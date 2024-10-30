import { object } from 'yup';
import { integrationProvidersRegistry } from '@reviewpal/common/integrations';

export const IntegrationConfigSchema = object()
  .required()
  .when(
    'provider',
    ([provider], schema) =>
      integrationProvidersRegistry.get(provider)?.schema ??
      schema.test({
        test: () => false,
        message: 'Unknown provider',
      })
  )
  .label('Config');
