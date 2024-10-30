import { createStateSelector, useStateSelector } from '@reviewpal/web/state';
import { useMemo } from 'react';

const stateSelector = createStateSelector(
  [({ interactivePrReviewer }) => interactivePrReviewer.files],
  (state) => state
);

export const useInteractivePrFiles = () => {
  const files = useStateSelector(stateSelector);

  return useMemo(() => files.all.map((filename) => files.byFilename[filename]).filter((file) => !!file), [files]);
};
