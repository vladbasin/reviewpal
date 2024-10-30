import type { InteractivePrPublishCommentArgsType } from '@reviewpal/common/reviewers';
import { InteractivePrReviewerApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IInteractivePrReviewerApi } from '@reviewpal/web/data';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';
import { createAsyncAction, InteractivePrReviewerSliceName } from '@reviewpal/web/state';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
class Executor implements IAsyncActionExecutor<void, InteractivePrPublishCommentArgsType & { commentId: string }> {
  public constructor(
    @inject(InteractivePrReviewerApiSid) private readonly _interactivePrReviewerApi: IInteractivePrReviewerApi
  ) {}

  public executeAsync(args: InteractivePrPublishCommentArgsType & { commentId: string }): Result<void> {
    const { commentId, ...restArgs } = args;

    return this._interactivePrReviewerApi
      .publishCommentAsync(restArgs)
      .withProcessedFailError((error) => processError(error));
  }
}

export const publishPrCommentAsync = createAsyncAction({
  sliceName: InteractivePrReviewerSliceName,
  actionName: 'publishPrCommentAsync',
  Executor,
});
