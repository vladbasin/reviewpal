import { inject, injectable } from 'inversify';
import type {
  IDataSourceProvider,
  IInteractivePrUserAnalyticsRepository,
  UpdateCountersArgsType,
} from '@reviewpal/be/data';
import { InteractivePrUserAnalyticsEntity, RepositoryBase } from '@reviewpal/be/data';
import { DataSourceProviderSid } from '@reviewpal/be/_sids';
import { Result } from '@vladbasin/ts-result';
import { v4 } from 'uuid';

@injectable()
export class InteractivePrUserAnalyticsRepository
  extends RepositoryBase<InteractivePrUserAnalyticsEntity>
  implements IInteractivePrUserAnalyticsRepository
{
  public constructor(@inject(DataSourceProviderSid) dataSourceProvider: IDataSourceProvider) {
    super(dataSourceProvider, InteractivePrUserAnalyticsEntity);
  }

  public updateCountersAsync({ userId, counters }: UpdateCountersArgsType): Result<void> {
    return Result.FromPromise(this.findOne({ where: { userId }, relations: { user: true } }))
      .onSuccess((analytics) => {
        if (analytics) {
          return analytics;
        }

        const id = v4();
        return this.create({ id, userId, user: { id: userId, interactivePrUserAnalyticsId: id } });
      })
      .onSuccessExecute((analytics) =>
        Object.entries(counters).forEach(([key, value]) => {
          const analyticsKey = key as keyof InteractivePrUserAnalyticsEntity;
          (analytics[analyticsKey] as number) = ((analytics[analyticsKey] as number) ?? 0) + value;
        })
      )
      .onSuccess((analytics) => this.save(analytics)).void;
  }
}
