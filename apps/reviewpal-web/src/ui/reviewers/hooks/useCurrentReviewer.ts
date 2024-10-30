import { createStateSelector, useStateSelector } from '@reviewpal/web/state';

const stateSelector = createStateSelector([({ currentReviewer }) => currentReviewer.reviewerConfig], (state) => state);

export const useCurrentReviewer = () => {
  return useStateSelector(stateSelector);
};
