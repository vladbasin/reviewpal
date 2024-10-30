import type { IntegrationSourceType } from '@reviewpal/common/integrations';
import { useCallback, useMemo } from 'react';
import { useIntegrationsAdminApi } from '@reviewpal/web/ui';

export const useIntegrationsListing = () => {
  const integrationsAdminApi = useIntegrationsAdminApi();

  const listAsync = useCallback(
    (source: IntegrationSourceType) => integrationsAdminApi.listAsync({ orderBy: 'name', filter: { source } }),
    [integrationsAdminApi]
  );

  return useMemo(() => ({ listAsync }), [listAsync]);
};
