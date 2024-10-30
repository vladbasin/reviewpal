import type { PrCommentSideType } from '@reviewpal/common/integrations';

export type PrCommentType = {
  id: string;
  changeKey: string;
  hunkIndex: number;
  changeIndex: number;
  filename: string;
  line: number;
  content: string;
  isLineRelated: boolean;
  isPublished: boolean;
  side: PrCommentSideType;
};
