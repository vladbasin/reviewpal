import { InteractivePrReviewerApiSid } from '@reviewpal/web/_sids';
import type { IInteractivePrReviewerApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useInteractivePrReviewerApi = () => {
  return useService<IInteractivePrReviewerApi>(InteractivePrReviewerApiSid);
};
