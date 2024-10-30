import type { IIntegrationProvider } from '@reviewpal/be/business';
import type { Maybe } from '@vladbasin/ts-types';

export interface IIntegrationsResolver {
  resolve<TProviderType extends IIntegrationProvider>(providerName: string): Maybe<TProviderType>;
}
