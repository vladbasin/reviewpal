import { inject, injectable } from 'inversify';
import type { IReviewerConfigsRepository } from '@reviewpal/be/data';
import { ReviewerConfigEntity } from '@reviewpal/be/data';
import { RepositoryBase, type IDataSourceProvider } from '@reviewpal/be/data';
import { DataSourceProviderSid } from '@reviewpal/be/_sids';

@injectable()
export class ReviewerConfigsRepository
  extends RepositoryBase<ReviewerConfigEntity>
  implements IReviewerConfigsRepository
{
  public constructor(@inject(DataSourceProviderSid) dataSourceProvider: IDataSourceProvider) {
    super(dataSourceProvider, ReviewerConfigEntity);
  }
}
