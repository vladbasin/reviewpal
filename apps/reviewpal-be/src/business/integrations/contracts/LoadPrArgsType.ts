import type { IntegrationType } from '@reviewpal/common/integrations';

export type LoadPrArgsType = {
  integration: IntegrationType;
  url: string;
};
