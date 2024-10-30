import type { ChangeData } from 'react-diff-view';

export type AddPrCommentArgsType = {
  filename: string;
  change: ChangeData;
  changeIndex: number;
  hunkIndex: number;
};
