import type {
  InteractivePrReviewerAnalyticsSummaryType,
  InteractivePrUserAnalyticsAdminApiType,
} from '@reviewpal/common/reviewers';
import type { ICrudApi } from '@reviewpal/web/data';
import type { Result } from '@vladbasin/ts-result';

export type IInteractivePrAnalyticsAdminApi = ICrudApi<InteractivePrUserAnalyticsAdminApiType> & {
  provideSummaryAsync(): Result<InteractivePrReviewerAnalyticsSummaryType>;
};
