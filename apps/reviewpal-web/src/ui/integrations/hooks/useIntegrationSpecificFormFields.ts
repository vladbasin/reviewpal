import type { KeySpecificComponentType } from '@reviewpal/web/ui';
import {
  BedrockClaudeIntegrationFormFields,
  GitHubIntegrationFormFields,
  useKeySpecificFormFields,
} from '@reviewpal/web/ui';
import type { Maybe } from '@vladbasin/ts-types';
import type { IntegrationArgsType } from '@reviewpal/common/integrations';
import {
  BedrockClaudeIntegrationProviderName,
  GitHubIntegrationProviderName,
  integrationProvidersRegistry,
} from '@reviewpal/common/integrations';

const ProviderToFormFieldsMap: Record<string, Maybe<KeySpecificComponentType<IntegrationArgsType>>> = {
  [BedrockClaudeIntegrationProviderName]: BedrockClaudeIntegrationFormFields,
  [GitHubIntegrationProviderName]: GitHubIntegrationFormFields,
};

type UseIntegrationSpecificFormFieldsOptionsType = {
  provider: string;
};

export const useIntegrationSpecificFormFields = ({ provider }: UseIntegrationSpecificFormFieldsOptionsType) =>
  useKeySpecificFormFields({ key: provider, map: ProviderToFormFieldsMap, registry: integrationProvidersRegistry });
