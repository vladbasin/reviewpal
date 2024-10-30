import { ReviewerConfigsApiSid } from '@reviewpal/web/_sids';
import type { IReviewerConfigsApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useReviewerConfigsApi = (): IReviewerConfigsApi => {
  return useService<IReviewerConfigsApi>(ReviewerConfigsApiSid);
};
