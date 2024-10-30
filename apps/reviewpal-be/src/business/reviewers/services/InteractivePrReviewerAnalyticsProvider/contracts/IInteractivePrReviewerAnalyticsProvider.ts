import type { InteractivePrReviewerAnalyticsSummaryType } from '@reviewpal/common/reviewers';
import type { Result } from '@vladbasin/ts-result';

export interface IInteractivePrReviewerAnalyticsProvider {
  provideSummaryAsync(): Result<InteractivePrReviewerAnalyticsSummaryType>;
}
