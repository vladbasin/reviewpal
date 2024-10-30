import { inject, injectable } from 'inversify';
import type { IUsersRepository } from '@reviewpal/be/data';
import { UserEntity } from '@reviewpal/be/data';
import { RepositoryBase, type IDataSourceProvider } from '@reviewpal/be/data';
import { DataSourceProviderSid } from '@reviewpal/be/_sids';

@injectable()
export class UsersRepository extends RepositoryBase<UserEntity> implements IUsersRepository {
  public constructor(@inject(DataSourceProviderSid) dataSourceProvider: IDataSourceProvider) {
    super(dataSourceProvider, UserEntity);
  }
}
