import { UsersAdminApiSid } from '@reviewpal/web/_sids';
import type { IUsersAdminApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useUsersAdminApi = (): IUsersAdminApi => {
  return useService<IUsersAdminApi>(UsersAdminApiSid);
};
