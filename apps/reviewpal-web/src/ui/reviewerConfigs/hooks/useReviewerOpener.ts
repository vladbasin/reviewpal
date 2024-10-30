import type { ReviewerConfigApiType } from '@reviewpal/common/reviewerConfigs';
import { InteractivePrReviewerName } from '@reviewpal/common/reviewerConfigs';
import type { Maybe } from '@vladbasin/ts-types';
import { useCallback, useMemo } from 'react';
import { useSnackbarPresenter, useTypedNavigate } from '@reviewpal/web/ui';

export const useReviewerOpener = () => {
  const navigate = useTypedNavigate();

  const snackbarPresenter = useSnackbarPresenter();

  const reviewerToPageOpenerMap = useMemo(
    (): Record<string, Maybe<(reviewerConfig: ReviewerConfigApiType) => void>> => ({
      [InteractivePrReviewerName]: ({ id }) => navigate('interactivePrReviewer', { id }),
    }),
    [navigate]
  );

  return useCallback(
    (reviewerConfig: ReviewerConfigApiType) => {
      const action = reviewerToPageOpenerMap[reviewerConfig.reviewer];
      if (action) {
        action(reviewerConfig);
      } else {
        snackbarPresenter.present({ message: 'This reviewer is not supported', severity: 'error' });
      }
    },
    [reviewerToPageOpenerMap, snackbarPresenter]
  );
};
