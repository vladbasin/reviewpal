import { inject, injectable } from 'inversify';
import type { IRefreshTokensRepository } from '@reviewpal/be/data';
import { RefreshTokenEntity, RepositoryBase } from '@reviewpal/be/data';
import type { IDataSourceProvider } from '@reviewpal/be/data';
import { DataSourceProviderSid } from '@reviewpal/be/_sids';

@injectable()
export class RefreshTokensRepository extends RepositoryBase<RefreshTokenEntity> implements IRefreshTokensRepository {
  public constructor(@inject(DataSourceProviderSid) dataSourceProvider: IDataSourceProvider) {
    super(dataSourceProvider, RefreshTokenEntity);
  }
}
