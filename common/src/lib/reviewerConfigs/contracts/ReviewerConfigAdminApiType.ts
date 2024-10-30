import type { IntegrationAdminApiType } from '@reviewpal/common/integrations';

export type ReviewerConfigAdminApiType = {
  id: string;
  name: string;
  reviewer: string;
  config: object;
  integrations: Omit<IntegrationAdminApiType, 'config'>[];
};
