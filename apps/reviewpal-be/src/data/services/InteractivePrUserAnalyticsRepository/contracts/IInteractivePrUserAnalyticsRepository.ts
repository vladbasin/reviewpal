import type { IRepositoryBase, InteractivePrUserAnalyticsEntity, UpdateCountersArgsType } from '@reviewpal/be/data';
import type { Result } from '@vladbasin/ts-result';

export type IInteractivePrUserAnalyticsRepository = IRepositoryBase<InteractivePrUserAnalyticsEntity> & {
  updateCountersAsync(args: UpdateCountersArgsType): Result<void>;
};
