import type { InteractivePrDiscussArgsType } from '@reviewpal/common/reviewers';

export type DiscussPrInteractivelyArgsType = InteractivePrDiscussArgsType & {
  commentId: string;
};
