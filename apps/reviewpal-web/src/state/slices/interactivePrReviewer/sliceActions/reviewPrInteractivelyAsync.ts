import type { InteractivePrReviewArgsType, InteractivePrReviewResultType } from '@reviewpal/common/reviewers';
import { InteractivePrReviewerApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IInteractivePrReviewerApi } from '@reviewpal/web/data';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';
import { createAsyncAction, InteractivePrReviewerSliceName } from '@reviewpal/web/state';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
class Executor implements IAsyncActionExecutor<InteractivePrReviewResultType, InteractivePrReviewArgsType> {
  public constructor(
    @inject(InteractivePrReviewerApiSid) private readonly _interactivePrReviewerApi: IInteractivePrReviewerApi
  ) {}

  public executeAsync(args: InteractivePrReviewArgsType): Result<InteractivePrReviewResultType> {
    return this._interactivePrReviewerApi.reviewAsync(args).withProcessedFailError((error) => processError(error));
  }
}

export const reviewPrInteractivelyAsync = createAsyncAction({
  sliceName: InteractivePrReviewerSliceName,
  actionName: 'reviewPrInteractivelyAsync',
  Executor,
});
