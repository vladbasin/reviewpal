import { ContainerModule } from 'inversify';
import type { ICrypter, ISecretsProvider } from '@reviewpal/be/cross-cutting';
import { Crypter, SecretsProvider } from '@reviewpal/be/cross-cutting';
import { CrypterSid, SecretsProviderSid } from '@reviewpal/be/_sids';

export const crossCuttingModule = new ContainerModule((bind) => {
  bind<ICrypter>(CrypterSid).to(Crypter).inSingletonScope();
  bind<ISecretsProvider>(SecretsProviderSid).to(SecretsProvider).inSingletonScope();
});
