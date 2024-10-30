import type {
  BedrockClaudeIntegrationConfigType,
  GitHubIntegrationConfigType,
  IntegrationSourceType,
} from '@reviewpal/common/integrations/contracts';
import {
  BedrockClaudeIntegrationConfigDefault,
  BedrockClaudeIntegrationConfigTypeSchema,
  BedrockClaudeIntegrationProviderName,
  GitHubIntegrationConfigDefault,
  GitHubIntegrationConfigTypeSchema,
  GitHubIntegrationProviderName,
} from '@reviewpal/common/integrations/contracts';
import type { ObjectRegistryEntryType } from '@reviewpal/common/cross-cutting';
import { ObjectRegistry } from '@reviewpal/common/cross-cutting';
import type { AnyObject } from 'yup';

type EntryType<TValue extends AnyObject = AnyObject> = ObjectRegistryEntryType<TValue> & {
  source: IntegrationSourceType;
};

export const integrationProvidersRegistry = new ObjectRegistry<EntryType>()
  .add<BedrockClaudeIntegrationConfigType, EntryType<BedrockClaudeIntegrationConfigType>>(
    BedrockClaudeIntegrationProviderName,
    {
      source: 'llm',
      schema: BedrockClaudeIntegrationConfigTypeSchema,
      defaultValue: BedrockClaudeIntegrationConfigDefault,
    }
  )
  .add<GitHubIntegrationConfigType, EntryType<GitHubIntegrationConfigType>>(GitHubIntegrationProviderName, {
    source: 'vcs',
    schema: GitHubIntegrationConfigTypeSchema,
    defaultValue: GitHubIntegrationConfigDefault,
    securedFields: ['token'],
  });
