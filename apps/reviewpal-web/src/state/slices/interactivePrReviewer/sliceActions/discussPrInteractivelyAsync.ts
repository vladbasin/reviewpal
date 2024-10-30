import { InteractivePrReviewerApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IInteractivePrReviewerApi } from '@reviewpal/web/data';
import type {
  DiscussPrInteractivelyArgsType,
  DiscussPrInteractivelyResultType,
  IAsyncActionExecutor,
} from '@reviewpal/web/state';
import { createAsyncAction, InteractivePrReviewerSliceName } from '@reviewpal/web/state';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
class Executor implements IAsyncActionExecutor<DiscussPrInteractivelyResultType, DiscussPrInteractivelyArgsType> {
  public constructor(
    @inject(InteractivePrReviewerApiSid) private readonly _interactivePrReviewerApi: IInteractivePrReviewerApi
  ) {}

  public executeAsync(args: DiscussPrInteractivelyArgsType): Result<DiscussPrInteractivelyResultType> {
    return this._interactivePrReviewerApi
      .discussAsync(args)
      .onSuccess((result) => ({ messages: result.messages, commentId: args.commentId }))
      .withProcessedFailError((error) => processError(error));
  }
}

export const discussPrInteractivelyAsync = createAsyncAction({
  sliceName: InteractivePrReviewerSliceName,
  actionName: 'discussPrInteractivelyAsync',
  Executor,
});
