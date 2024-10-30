import { inject, injectable } from 'inversify';
import type {
  CrudControllerCreateOperationType,
  CrudControllerOperationType,
  CrudControllerUpdateOperationType,
} from '@reviewpal/be/api';
import { CrudControllerBase, mapIntegrationEntityToApiItemAsync, type IController } from '@reviewpal/be/api';
import { ApiRoutes } from '@reviewpal/common/api';
import { CrypterSid, ReviewerConfigsRepositorySid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import type { ITokenAuthorizer } from '@reviewpal/be/business';
import type { IReviewerConfigsRepository, ReviewerConfigEntity, IRepositoryBase } from '@reviewpal/be/data';
import {
  type ReviewerConfigArgsType,
  type ReviewerConfigAdminApiType,
  ReviewerConfigArgsTypeSchema,
} from '@reviewpal/common/reviewerConfigs';
import { Result } from '@vladbasin/ts-result';
import { v4 } from 'uuid';
import { isNil, orderBy } from 'lodash';
import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { ICrypter } from '@reviewpal/be/cross-cutting';

@injectable()
export class ReviewerConfigsAdminController
  extends CrudControllerBase<ReviewerConfigEntity, ReviewerConfigAdminApiType, ReviewerConfigArgsType>
  implements IController
{
  public constructor(
    @inject(ReviewerConfigsRepositorySid) private readonly _reviewerConfigsRepository: IReviewerConfigsRepository,
    @inject(CrypterSid) protected readonly _crypter: ICrypter,
    @inject(TokenAuthorizerSid) protected readonly _tokenAuthorizer: ITokenAuthorizer
  ) {
    super(_tokenAuthorizer);
  }

  protected get repository(): IRepositoryBase<ReviewerConfigEntity> {
    return this._reviewerConfigsRepository;
  }

  protected getOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.reviewerConfigs.one,
  };
  protected listOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.reviewerConfigs.many,
  };
  protected deleteOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.reviewerConfigs.one,
  };
  protected createOperation: CrudControllerCreateOperationType<ReviewerConfigEntity, ReviewerConfigArgsType> = {
    auth: ['admin'],
    route: ApiRoutes.admin.reviewerConfigs.many,
    schema: ReviewerConfigArgsTypeSchema,
    mapArgsToEntityAsync: ({ name, reviewer, config, integrations }) => {
      const id = v4();
      return this.mapArgsIntegrationsToEntityIntegrationsAsync(id, integrations).onSuccess(
        (integrationsInReviewerConfigs) =>
          this._reviewerConfigsRepository.create({
            id,
            name,
            reviewer,
            config,
            integrationsInReviewerConfigs,
          })
      );
    },
  };
  protected updateOperation: CrudControllerUpdateOperationType<ReviewerConfigEntity, ReviewerConfigArgsType> = {
    auth: ['admin'],
    route: ApiRoutes.admin.reviewerConfigs.one,
    schema: ReviewerConfigArgsTypeSchema,
    selectArgs: ({ name, config, integrations }, existingEntity) => ({ ...existingEntity, name, config, integrations }),
    mapArgsToEntityAsync: ({ name, config, integrations }, existingEntity) =>
      this.mapArgsIntegrationsToEntityIntegrationsAsync(existingEntity.id, integrations).onSuccess(
        (integrationsInReviewerConfigs) =>
          this._reviewerConfigsRepository.create({
            ...existingEntity,
            name,
            config,
            integrationsInReviewerConfigs,
          })
      ),
  };

  protected mapEntityToApiItemAsync({
    id,
    name,
    reviewer,
    config,
    integrationsInReviewerConfigs,
  }: ReviewerConfigEntity): Result<ReviewerConfigAdminApiType> {
    return Result.Combine(
      (integrationsInReviewerConfigs ?? [])
        .map((t) => t.integration)
        .filter((t) => !isNil(t))
        .map((integration) => mapIntegrationEntityToApiItemAsync(integration, this._crypter))
    ).onSuccess((integrations) => ({
      id,
      name,
      reviewer,
      config,
      integrations:
        orderBy(
          integrations.map((integration) => {
            // Not using config, we just need to remove it from the object
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { config, ...rest } = integration;
            return rest;
          }),
          ['source']
        ) ?? [],
    }));
  }

  private mapArgsIntegrationsToEntityIntegrationsAsync(reviewerConfigId: string, integrations: IdentifiableType[]) {
    return Result.Ok(integrations.map((integration) => ({ integrationId: integration.id, reviewerConfigId })));
  }
}
