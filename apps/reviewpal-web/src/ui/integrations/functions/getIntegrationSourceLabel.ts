import type { IntegrationSourceType } from '@reviewpal/common/integrations';

export const getIntegrationSourceLabel = (source: IntegrationSourceType) => source.toUpperCase();
