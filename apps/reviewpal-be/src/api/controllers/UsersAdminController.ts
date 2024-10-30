import { UsersValidatorSid, UsersRepositorySid, PasswordAuthorizerSid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import type {
  CrudControllerCreateOperationType,
  CrudControllerOperationType,
  CrudControllerUpdateOperationType,
  SuccessHandleResult,
} from '@reviewpal/be/api';
import {
  CrudControllerBase,
  handleApiRequestAsync,
  mapUserEntityToAdminApiItem,
  requireAuth,
  type IController,
} from '@reviewpal/be/api';
import type { IPasswordAuthorizer, ITokenAuthorizer, IUsersValidator } from '@reviewpal/be/business';
import type { IRepositoryBase, IUsersRepository, UserEntity } from '@reviewpal/be/data';
import { ApiRoutes } from '@reviewpal/common/api';
import { IdentifiableTypeSchema, validateSchemaEarlyAsync } from '@reviewpal/common/cross-cutting';
import { UserArgsTypeSchema, type UserAdminApiType, type UserArgsType } from '@reviewpal/common/users';
import { Result } from '@vladbasin/ts-result';
import type { Router } from 'express';
import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

@injectable()
export class UsersAdminController
  extends CrudControllerBase<UserEntity, UserAdminApiType, UserArgsType>
  implements IController
{
  public constructor(
    @inject(UsersRepositorySid) private readonly _usersRepository: IUsersRepository,
    @inject(UsersValidatorSid) private readonly _usersValidator: IUsersValidator,
    @inject(PasswordAuthorizerSid) private readonly _passwordAuthorizer: IPasswordAuthorizer,
    @inject(TokenAuthorizerSid) protected readonly _tokenAuthorizer: ITokenAuthorizer
  ) {
    super(_tokenAuthorizer);
  }

  public register(router: Router): void {
    super.register(router);

    router.post(
      ApiRoutes.admin.users.requestPasswordReset,
      requireAuth(this._tokenAuthorizer, ['admin']),
      this.requestPasswordResetTokenAsync()
    );
  }

  protected get repository(): IRepositoryBase<UserEntity> {
    return this._usersRepository;
  }

  protected getOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.users.one,
  };
  protected listOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.users.many,
  };
  protected deleteOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.users.one,
  };
  protected createOperation: CrudControllerCreateOperationType<UserEntity, UserArgsType> = {
    auth: ['admin'],
    route: ApiRoutes.admin.users.many,
    schema: UserArgsTypeSchema,
    mapArgsToEntityAsync: ({ name, email, role }) =>
      Result.Ok(this._usersRepository.create({ id: v4(), name, email, role, password: '' })),
    validateArgsAsync: this._usersValidator.validateCreateArgsAsync.bind(this._usersValidator),
  };
  protected updateOperation: CrudControllerUpdateOperationType<UserEntity, UserArgsType> = {
    auth: ['admin'],
    route: ApiRoutes.admin.users.one,
    schema: UserArgsTypeSchema,
    selectArgs: ({ name, email, role }, existingEntity) => ({ ...existingEntity, name, email, role }),
    mapArgsToEntityAsync: ({ name, email, role }, existingEntity) =>
      Result.Ok({ ...existingEntity, name, email, role }),
    validateArgsAsync: (args, existingEntity) => this._usersValidator.validateUpdateArgsAsync(existingEntity.id, args),
  };

  protected mapEntityToApiItemAsync(user: UserEntity): Result<UserAdminApiType> {
    return Result.Ok(mapUserEntityToAdminApiItem(user));
  }

  private requestPasswordResetTokenAsync() {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) => {
        const args = { id: req.params.id };

        return validateSchemaEarlyAsync(args, IdentifiableTypeSchema, true)
          .onSuccess(() => this._passwordAuthorizer.requestPasswordResetTokenAsync(args.id))
          .onSuccess((resetToken): SuccessHandleResult => ({ statusCode: 200, data: resetToken.id }));
      },
    });
  }
}
