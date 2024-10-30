import type {
  IntegrationAdminApiType,
  IntegrationArgsType,
  IntegrationSourceType,
} from '@reviewpal/common/integrations';
import { IntegrationArgsTypeSchema } from '@reviewpal/common/integrations';
import type { UseCrudFormExternalOptionsType } from '@reviewpal/web/ui';
import { useCrudForm, useIntegrationsAdminApi } from '@reviewpal/web/ui';
import { cloneDeep } from 'lodash';

export const useIntegrationForm = (options: UseCrudFormExternalOptionsType<IntegrationAdminApiType>) => {
  const integrationsAdminApi = useIntegrationsAdminApi();

  return useCrudForm<IntegrationAdminApiType, IntegrationArgsType>({
    ...options,
    api: integrationsAdminApi,
    schema: IntegrationArgsTypeSchema,
    getInitialValues: (target) => ({
      id: '',
      name: '',
      // Assigning as empty to allow user select first and not break strongly typed guarantee for the code after validation is successful
      source: '' as IntegrationSourceType,
      provider: '',
      config: {},
      ...cloneDeep(target),
    }),
  });
};
