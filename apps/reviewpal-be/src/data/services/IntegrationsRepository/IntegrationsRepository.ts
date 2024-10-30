import { inject, injectable } from 'inversify';
import { IntegrationEntity } from '@reviewpal/be/data';
import { RepositoryBase, type IDataSourceProvider, type IIntegrationsRepository } from '@reviewpal/be/data';
import { DataSourceProviderSid } from '@reviewpal/be/_sids';

@injectable()
export class IntegrationsRepository extends RepositoryBase<IntegrationEntity> implements IIntegrationsRepository {
  public constructor(@inject(DataSourceProviderSid) dataSourceProvider: IDataSourceProvider) {
    super(dataSourceProvider, IntegrationEntity);
  }
}
