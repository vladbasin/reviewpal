import type { ReviewerConfigApiType } from '@reviewpal/common/reviewerConfigs';
import { ReviewerConfigsApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IReviewerConfigsApi } from '@reviewpal/web/data';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';
import { createAsyncAction, CurrentReviewerSliceName } from '@reviewpal/web/state';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
class Executor implements IAsyncActionExecutor<ReviewerConfigApiType, string> {
  public constructor(@inject(ReviewerConfigsApiSid) private readonly _reviewerConfigs: IReviewerConfigsApi) {}

  public executeAsync(id: string): Result<ReviewerConfigApiType> {
    return this._reviewerConfigs.getAsync(id).withProcessedFailError((error) => processError(error));
  }
}

export const loadReviewerAsync = createAsyncAction({
  sliceName: CurrentReviewerSliceName,
  actionName: 'loadReviewerAsync',
  Executor,
});
