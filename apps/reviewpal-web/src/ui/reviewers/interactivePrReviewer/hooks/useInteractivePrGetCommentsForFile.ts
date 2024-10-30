import { createStateSelector, useStateSelector } from '@reviewpal/web/state';
import { useCallback } from 'react';

const stateSelector = createStateSelector(
  [
    ({ interactivePrReviewer }) => interactivePrReviewer.comments.byFilename,
    ({ interactivePrReviewer }) => interactivePrReviewer.comments.byId,
  ],
  (byFilename, byId) => ({ byFilename, byId })
);

export const useInteractivePrGetCommentsForFile = () => {
  const { byFilename, byId } = useStateSelector(stateSelector);

  return useCallback(
    (filename: string) => byFilename[filename]?.map((id) => byId[id]).filter((comment) => !!comment) ?? [],
    [byFilename, byId]
  );
};
