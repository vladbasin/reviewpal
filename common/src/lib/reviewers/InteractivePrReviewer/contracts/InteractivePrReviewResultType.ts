import type { PrType } from '@reviewpal/common/integrations';

export type InteractivePrReviewResultType = {
  pullRequest: PrType;
  suggestions?: InteractivePrReviewSuggestionType[];
};

export type InteractivePrReviewSuggestionType = {
  filename: string;
  lineNumber: number;
  lineIdSubstring: string;
  suggestion: string;
};
