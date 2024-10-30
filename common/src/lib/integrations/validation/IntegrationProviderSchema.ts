import { string } from 'yup';
import { integrationProvidersRegistry } from '@reviewpal/common/integrations';

export const IntegrationProviderSchema = string()
  .oneOf(integrationProvidersRegistry.getAllNames())
  .required()
  .when('source', ([source], schema, { value: provider }) =>
    integrationProvidersRegistry.get(provider)?.source === source
      ? schema
      : schema.test({
          test: () => false,
          message: 'Provider is not allowed for given source',
        })
  )
  .label('Provider');
