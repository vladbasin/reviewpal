import type { IntegrationType, PrCommentSideType } from '@reviewpal/common/integrations';

export type PublishPrCommentArgsType = {
  integration: IntegrationType;
  url: string;
  filename: string;
  content: string;
  line: number;
  sha: string;
  side?: PrCommentSideType;
};
