import type { ReviewerConfigArgsType, ReviewerConfigAdminApiType } from '@reviewpal/common/reviewerConfigs';
import type { ICrudApi } from '@reviewpal/web/data';

export type IReviewerConfigsAdminApi = ICrudApi<ReviewerConfigAdminApiType, ReviewerConfigArgsType>;
