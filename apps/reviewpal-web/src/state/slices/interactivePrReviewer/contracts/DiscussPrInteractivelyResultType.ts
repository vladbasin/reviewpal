import type { InteractivePrDiscussResultType } from '@reviewpal/common/reviewers';

export type DiscussPrInteractivelyResultType = InteractivePrDiscussResultType & {
  commentId: string;
};
