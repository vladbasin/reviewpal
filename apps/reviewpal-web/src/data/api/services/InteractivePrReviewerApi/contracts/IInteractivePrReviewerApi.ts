import type {
  InteractivePrDiscussArgsType,
  InteractivePrDiscussResultType,
  InteractivePrPublishCommentArgsType,
  InteractivePrReviewArgsType,
  InteractivePrReviewResultType,
} from '@reviewpal/common/reviewers';
import type { Result } from '@vladbasin/ts-result';

export interface IInteractivePrReviewerApi {
  reviewAsync(args: InteractivePrReviewArgsType): Result<InteractivePrReviewResultType>;
  discussAsync(args: InteractivePrDiscussArgsType): Result<InteractivePrDiscussResultType>;
  publishCommentAsync(args: InteractivePrPublishCommentArgsType): Result<void>;
}
