import type { IntegrationArgsType, IntegrationAdminApiType } from '@reviewpal/common/integrations';
import type { ICrudApi } from '@reviewpal/web/data';

export type IIntegrationsAdminApi = ICrudApi<IntegrationAdminApiType, IntegrationArgsType>;
