import { inject, injectable } from 'inversify';
import { RepositoryBase, ResetPasswordTokenEntity } from '@reviewpal/be/data';
import type { IDataSourceProvider, RefreshTokenEntity } from '@reviewpal/be/data';
import { DataSourceProviderSid } from '@reviewpal/be/_sids';
import type { IResetPasswordTokensRepository } from '@reviewpal/be/data';

@injectable()
export class ResetPasswordTokensRepository
  extends RepositoryBase<RefreshTokenEntity>
  implements IResetPasswordTokensRepository
{
  public constructor(@inject(DataSourceProviderSid) dataSourceProvider: IDataSourceProvider) {
    super(dataSourceProvider, ResetPasswordTokenEntity);
  }
}
