import type { Maybe } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import type { ChangeData, FileData } from 'react-diff-view';

// TODO: improve performance by precalculating change location (not available in the react-diff-view library)
export const findChangeLocation = (
  file: FileData,
  change: ChangeData
): Maybe<{ hunkIndex: number; changeIndex: number }> => {
  let hunkIndex: Maybe<number>;
  let changeIndex: Maybe<number>;

  for (let h = 0; h < file.hunks.length; h++) {
    const hunk = file.hunks[h];
    for (let c = 0; c < hunk.changes.length; c++) {
      const currentChange = hunk.changes[c];
      if (currentChange === change) {
        hunkIndex = h;
        changeIndex = c;
        break;
      }
    }

    if (!isNil(hunkIndex) && !isNil(changeIndex)) {
      break;
    }
  }

  return isNil(hunkIndex) || isNil(changeIndex) ? undefined : { hunkIndex, changeIndex };
};
