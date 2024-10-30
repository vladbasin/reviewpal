import { IntegrationProviderSid } from '@reviewpal/be/_sids';
import type { IIntegrationProvider, IIntegrationsResolver } from '@reviewpal/be/business';
import type { Maybe } from '@vladbasin/ts-types';
import { injectable, multiInject } from 'inversify';

@injectable()
export class IntegrationsResolver implements IIntegrationsResolver {
  constructor(@multiInject(IntegrationProviderSid) private readonly integrationProviders: IIntegrationProvider[]) {
    this._providerNameToProviderMap = this.integrationProviders.reduce((acc, provider) => {
      acc.set(provider.name, provider);
      return acc;
    }, new Map<string, IIntegrationProvider>());
  }

  public resolve<TProviderType extends IIntegrationProvider>(providerName: string): Maybe<TProviderType> {
    return this._providerNameToProviderMap.get(providerName) as Maybe<TProviderType>;
  }

  private _providerNameToProviderMap: Map<string, IIntegrationProvider>;
}
