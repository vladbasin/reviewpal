import type { PrFileType } from '@reviewpal/common/integrations';
import type { FileData } from 'react-diff-view';

export type PrFileWithDiffType = {
  pr: PrFileType;
  diff: FileData;
};
