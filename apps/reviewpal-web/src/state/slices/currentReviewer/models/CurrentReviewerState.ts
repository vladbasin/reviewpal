import type { ReviewerConfigApiType } from '@reviewpal/common/reviewerConfigs';
import type { LoadableStateType } from '@reviewpal/web/state';
import { LoadableStateBase } from '@reviewpal/web/state';
import { type Draft } from 'immer';

type CurrentReviewerStateType = LoadableStateType & {
  reviewerConfig?: ReviewerConfigApiType;
};

export class CurrentReviewerState extends LoadableStateBase<ReviewerConfigApiType, CurrentReviewerStateType> {
  public readonly reviewerConfig?: ReviewerConfigApiType;

  public static createInitialState(): CurrentReviewerStateType {
    return super.createInitialLoadableState();
  }

  protected setValue(draft: Draft<CurrentReviewerStateType>, value?: ReviewerConfigApiType): void {
    draft.reviewerConfig = value;
  }
}
