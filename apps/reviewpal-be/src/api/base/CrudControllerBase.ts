import type {
  CrudControllerCreateOperationType,
  CrudControllerOperationType,
  CrudControllerUpdateOperationType,
  IController,
  SuccessHandleResult,
} from '@reviewpal/be/api';
import { handleApiRequestAsync, requireAuth } from '@reviewpal/be/api';
import type { ITokenAuthorizer } from '@reviewpal/be/business';
import type { IRepositoryBase } from '@reviewpal/be/data';
import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import {
  CodedError,
  IdentifiableTypeSchema,
  ItemListArgsTypeSchema,
  NotFoundError,
  validateSchemaEarlyAsync,
} from '@reviewpal/common/cross-cutting';
import { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import { HttpStatusCode } from 'axios';
import type { IRouterMatcher, RequestHandler, Router } from 'express';
import { isNil, cloneDeep } from 'lodash';

export abstract class CrudControllerBase<
  TEntity extends IdentifiableType,
  TApiItem,
  TEntityArgs extends object = Record<string, unknown>
> implements IController
{
  public constructor(protected readonly _tokenAuthorizer: ITokenAuthorizer) {}

  public register(router: Router): void {
    this.registerOperationIfEnabled(this.createOperation, router.put.bind(router), (operation) =>
      this.create(operation)
    );
    this.registerOperationIfEnabled(this.updateOperation, router.patch.bind(router), (operation) =>
      this.update(operation)
    );
    this.registerOperationIfEnabled(this.getOperation, router.get.bind(router), () => this.get());
    this.registerOperationIfEnabled(this.deleteOperation, router.delete.bind(router), () => this.delete());
    this.registerOperationIfEnabled(this.listOperation, router.post.bind(router), () => this.list());
  }

  protected abstract repository: IRepositoryBase<TEntity>;
  protected abstract createOperation?: CrudControllerCreateOperationType<TEntity, TEntityArgs>;
  protected abstract getOperation?: CrudControllerOperationType;
  protected abstract listOperation?: CrudControllerOperationType;
  protected abstract updateOperation?: CrudControllerUpdateOperationType<TEntity, TEntityArgs>;
  protected abstract deleteOperation?: CrudControllerOperationType;
  protected abstract mapEntityToApiItemAsync(entity: TEntity): Result<TApiItem>;

  private registerOperationIfEnabled<TOperation extends CrudControllerOperationType>(
    operation: Maybe<TOperation>,
    routerMethod: IRouterMatcher<unknown>,
    handler: (operation: TOperation) => RequestHandler
  ) {
    if (!operation) {
      return;
    }

    const handlers: RequestHandler[] = [];
    if (operation.auth !== false) {
      handlers.push(requireAuth(this._tokenAuthorizer, operation.auth));
    }
    handlers.push(handler(operation));

    routerMethod(operation.route, ...handlers);
  }

  private get(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) => {
        const args = { id: req.params.id };

        return validateSchemaEarlyAsync(args, IdentifiableTypeSchema, true)
          .onSuccess(() => this.repository.findOneEntityById(args.id))
          .ensureUnwrapAsProcessedWithError(
            (entity) => entity,
            new CodedError({ code: NotFoundError, message: 'Item not found' })
          )
          .onSuccess((entity) => this.mapEntityToApiItemAsync(entity))
          .onSuccess((apiItem): SuccessHandleResult => ({ statusCode: HttpStatusCode.Ok, data: apiItem }));
      },
    });
  }

  private list(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) =>
        validateSchemaEarlyAsync(req.body, ItemListArgsTypeSchema, true).onSuccess(() =>
          this.repository
            .listAsync(req.body)
            .onSuccess((list) =>
              Result.CombineFactories(
                list.map((item) => () => this.mapEntityToApiItemAsync(item)),
                { concurrency: 1 }
              )
            )
            .onSuccess((apiItems): SuccessHandleResult => ({ statusCode: HttpStatusCode.Ok, data: apiItems }))
        ),
    });
  }

  private create(operation: CrudControllerCreateOperationType<TEntity, TEntityArgs>): RequestHandler {
    const { schema, mapArgsToEntityAsync, validateArgsAsync, overrideAsync } = operation;

    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req, res) =>
        Result.Ok(cloneDeep(req.body))
          .onSuccessExecute((args) => validateSchemaEarlyAsync(args, schema, true))
          .onSuccessExecute((args) => validateArgsAsync?.(args))
          .onSuccess((args) =>
            mapArgsToEntityAsync(args).onSuccess((entity) =>
              isNil(overrideAsync)
                ? Result.FromPromise(this.repository.save(entity))
                    .onSuccess((entity) => this.mapEntityToApiItemAsync(entity))
                    .onSuccess((apiItem) => ({ statusCode: HttpStatusCode.Created, data: apiItem }))
                : overrideAsync({ args, entity, operation, req, res })
            )
          ),
    });
  }

  private update(operation: CrudControllerUpdateOperationType<TEntity, TEntityArgs>): RequestHandler {
    const { schema, selectArgs, mapArgsToEntityAsync, validateArgsAsync, overrideAsync } = operation;

    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) => {
        const paramsArgs = { id: req.params.id };

        return Result.Ok<TEntityArgs>(cloneDeep(req.body))
          .onSuccessExecute(() => validateSchemaEarlyAsync(paramsArgs, IdentifiableTypeSchema, true))
          .onSuccess((rawArgs) =>
            this.repository.findOneEntityByIdOrFail(paramsArgs.id).onSuccess((existingEntity) =>
              Result.Ok(selectArgs(rawArgs, existingEntity))
                .onSuccessExecute((args) => validateSchemaEarlyAsync(args, schema, true))
                .onSuccessExecute((args) => validateArgsAsync?.(args, existingEntity))
                .onSuccess((args) =>
                  isNil(overrideAsync)
                    ? mapArgsToEntityAsync(args, existingEntity)
                        .onSuccess((updatedEntity) => this.repository.save(updatedEntity))
                        .onSuccess((updatedEntity) =>
                          // Fetching again, because save doesn't return the updated relations
                          this.repository.findOneEntityByIdOrFail(updatedEntity.id)
                        )
                        .onSuccess((updatedEntity) => this.mapEntityToApiItemAsync(updatedEntity))
                        .onSuccess((apiItem) => ({ statusCode: HttpStatusCode.Ok, data: apiItem }))
                    : overrideAsync(args, existingEntity, operation)
                )
            )
          );
      },
    });
  }

  private delete(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) => {
        const args = { id: req.params.id };

        return validateSchemaEarlyAsync(args, IdentifiableTypeSchema, true)
          .onSuccess(() => this.repository.findOneEntityById(args.id))
          .ensureUnwrapAsProcessedWithError(
            (entity) => entity,
            new CodedError({ code: NotFoundError, message: 'Item not found' })
          )
          .onSuccessExecute(() =>
            this.repository.isSoftDeleteEnabled ? this.repository.softDelete(args.id) : this.repository.delete(args.id)
          )
          .onSuccess((entity) => this.mapEntityToApiItemAsync(entity))
          .onSuccess((apiItem) => ({ statusCode: HttpStatusCode.Ok, data: apiItem }));
      },
    });
  }
}
