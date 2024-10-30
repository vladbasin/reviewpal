import type { ObjectSchema } from 'yup';
import { object } from 'yup';
import type { IntegrationSourceType } from '@reviewpal/common/integrations';
import {
  IntegrationConfigSchema,
  IntegrationNameSchema,
  IntegrationProviderSchema,
  IntegrationSourceSchema,
} from '@reviewpal/common/integrations';

export type IntegrationArgsType = {
  name: string;
  source: IntegrationSourceType;
  provider: string;
  config: object;
};

export const IntegrationArgsTypeSchema: ObjectSchema<IntegrationArgsType> = object({
  name: IntegrationNameSchema,
  source: IntegrationSourceSchema,
  provider: IntegrationProviderSchema,
  config: IntegrationConfigSchema,
});
