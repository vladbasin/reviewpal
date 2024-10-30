import { ReviewerConfigsAdminApiSid } from '@reviewpal/web/_sids';
import type { IReviewerConfigsAdminApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useReviewerConfigsAdminApi = (): IReviewerConfigsAdminApi => {
  return useService<IReviewerConfigsAdminApi>(ReviewerConfigsAdminApiSid);
};
