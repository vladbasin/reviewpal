import { InteractivePrAnalyticsAdminApiSid } from '@reviewpal/web/_sids';
import type { IInteractivePrAnalyticsAdminApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useInteractivePrAnalyticsAdminApi = (): IInteractivePrAnalyticsAdminApi => {
  return useService<IInteractivePrAnalyticsAdminApi>(InteractivePrAnalyticsAdminApiSid);
};
