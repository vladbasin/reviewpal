import type { Result } from '@vladbasin/ts-result';
import type { IIntegrationProvider, LoadPrArgsType, PublishPrCommentArgsType } from '@reviewpal/be/business';
import type { PrType } from '@reviewpal/common/integrations';

export interface IVcsIntegrationProvider extends IIntegrationProvider {
  loadPrAsync(args: LoadPrArgsType): Result<PrType>;
  publishPrCommentAsync(args: PublishPrCommentArgsType): Result<void>;
}
