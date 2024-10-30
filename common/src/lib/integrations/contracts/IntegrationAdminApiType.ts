import type { IntegrationSourceType } from '@reviewpal/common/integrations';

export type IntegrationAdminApiType = {
  id: string;
  name: string;
  source: IntegrationSourceType;
  provider: string;
  config: object;
};
