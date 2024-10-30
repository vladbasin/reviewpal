import { inject, injectable } from 'inversify';
import type {
  CrudControllerCreateOperationType,
  CrudControllerOperationType,
  CrudControllerUpdateOperationType,
} from '@reviewpal/be/api';
import { CrudControllerBase, mapIntegrationEntityToApiItemAsync, type IController } from '@reviewpal/be/api';
import { ApiRoutes } from '@reviewpal/common/api';
import { CrypterSid, IntegrationsRepositorySid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import type { ITokenAuthorizer } from '@reviewpal/be/business';
import type { IIntegrationsRepository, IntegrationEntity, IRepositoryBase } from '@reviewpal/be/data';
import type { IntegrationArgsType } from '@reviewpal/common/integrations';
import {
  IntegrationArgsTypeSchema,
  integrationProvidersRegistry,
  type IntegrationAdminApiType,
} from '@reviewpal/common/integrations';
import { Result } from '@vladbasin/ts-result';
import { v4 } from 'uuid';
import type { ICrypter } from '@reviewpal/be/cross-cutting';

@injectable()
export class IntegrationsAdminController
  extends CrudControllerBase<IntegrationEntity, IntegrationAdminApiType, IntegrationArgsType>
  implements IController
{
  public constructor(
    @inject(IntegrationsRepositorySid) private readonly _integrationsRepository: IIntegrationsRepository,
    @inject(TokenAuthorizerSid) protected readonly _tokenAuthorizer: ITokenAuthorizer,
    @inject(CrypterSid) protected readonly _crypter: ICrypter
  ) {
    super(_tokenAuthorizer);
  }

  protected get repository(): IRepositoryBase<IntegrationEntity> {
    return this._integrationsRepository;
  }

  protected getOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.integrations.one,
  };
  protected listOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.integrations.many,
  };
  protected deleteOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.integrations.one,
  };
  protected createOperation: CrudControllerCreateOperationType<IntegrationEntity, IntegrationArgsType> = {
    auth: ['admin'],
    route: ApiRoutes.admin.integrations.many,
    schema: IntegrationArgsTypeSchema,
    mapArgsToEntityAsync: ({ name, source, provider, config }) =>
      Result.Ok(
        this._integrationsRepository.create({
          id: v4(),
          name,
          source,
          provider,
          config: this._crypter.secureObject(
            'encrypt',
            config,
            integrationProvidersRegistry.get(provider)?.securedFields
          ),
        })
      ),
  };
  protected updateOperation: CrudControllerUpdateOperationType<IntegrationEntity, IntegrationArgsType> = {
    auth: ['admin'],
    route: ApiRoutes.admin.integrations.one,
    schema: IntegrationArgsTypeSchema,
    selectArgs: ({ name, config }, existingEntity) => ({ ...existingEntity, name, config }),
    mapArgsToEntityAsync: ({ name, config }, existingEntity) =>
      Result.Ok({
        ...existingEntity,
        name,
        config: this._crypter.restoreStrippedObject(
          config,
          existingEntity.config,
          integrationProvidersRegistry.get(existingEntity.provider)?.securedFields
        ),
      }),
  };

  protected mapEntityToApiItemAsync(entity: IntegrationEntity): Result<IntegrationAdminApiType> {
    return mapIntegrationEntityToApiItemAsync(entity, this._crypter);
  }
}
