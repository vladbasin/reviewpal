import { AuthApiSid } from '@reviewpal/web/_sids';
import type { IAuthApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useAuthApi = (): IAuthApi => {
  return useService<IAuthApi>(AuthApiSid);
};
