import type { WithUser, WithUserId } from '@reviewpal/be/cross-cutting';
import type {
  InteractivePrDiscussArgsType,
  InteractivePrDiscussResultType,
  InteractivePrPublishCommentArgsType,
  InteractivePrReviewArgsType,
  InteractivePrReviewResultType,
} from '@reviewpal/common/reviewers';
import type { Result } from '@vladbasin/ts-result';

export interface IInteractivePrReviewer {
  reviewAsync(args: WithUserId<InteractivePrReviewArgsType>): Result<InteractivePrReviewResultType>;
  discussAsync(args: WithUserId<InteractivePrDiscussArgsType>): Result<InteractivePrDiscussResultType>;
  publishCommentAsync(args: WithUser<InteractivePrPublishCommentArgsType>): Result<void>;
}
