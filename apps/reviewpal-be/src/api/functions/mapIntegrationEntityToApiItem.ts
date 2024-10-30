import type { ICrypter } from '@reviewpal/be/cross-cutting';
import type { IntegrationEntity } from '@reviewpal/be/data';
import { integrationProvidersRegistry, type IntegrationAdminApiType } from '@reviewpal/common/integrations';
import { Result } from '@vladbasin/ts-result';

export const mapIntegrationEntityToApiItemAsync = (
  { id, name, source, provider, config }: IntegrationEntity,
  crypter: ICrypter
): Result<IntegrationAdminApiType> => {
  return Result.Ok({
    id,
    name,
    source,
    provider,
    config: crypter.secureObject('strip', config, integrationProvidersRegistry.get(provider)?.securedFields),
  });
};
