import { IntegrationsAdminApiSid } from '@reviewpal/web/_sids';
import type { IIntegrationsAdminApi } from '@reviewpal/web/data';
import { useService } from '@reviewpal/web/ui';

export const useIntegrationsAdminApi = (): IIntegrationsAdminApi => {
  return useService<IIntegrationsAdminApi>(IntegrationsAdminApiSid);
};
