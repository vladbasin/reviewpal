import { createStateSelector, useStateSelector } from '@reviewpal/web/state';

const urlSelector = createStateSelector([({ interactivePrReviewer }) => interactivePrReviewer.url], (state) => state);

export const useInteractivePrUrl = () => {
  return useStateSelector(urlSelector);
};
