import { ContainerModule } from 'inversify';
import type {
  IRefreshTokensRepository,
  IUsersRepository,
  IDataSourceProvider,
  IResetPasswordTokensRepository,
  IReviewerConfigsRepository,
  IIntegrationsRepository,
  IInteractivePrUserAnalyticsRepository,
} from '@reviewpal/be/data';
import {
  DataSourceProvider,
  IntegrationsRepository,
  InteractivePrUserAnalyticsRepository,
  RefreshTokensRepository,
  ResetPasswordTokensRepository,
  ReviewerConfigsRepository,
  UsersRepository,
} from '@reviewpal/be/data';
import {
  DataSourceProviderSid,
  IntegrationsRepositorySid,
  InteractivePrUserAnalyticsRepositorySid,
  RefreshTokensRepositorySid,
  ResetPasswordTokensRepositorySid,
  ReviewerConfigsRepositorySid,
  UsersRepositorySid,
} from '@reviewpal/be/_sids';

export const dataModule = new ContainerModule((bind) => {
  bind<IDataSourceProvider>(DataSourceProviderSid).to(DataSourceProvider).inSingletonScope();
  bind<IUsersRepository>(UsersRepositorySid).to(UsersRepository).inTransientScope();
  bind<IRefreshTokensRepository>(RefreshTokensRepositorySid).to(RefreshTokensRepository).inTransientScope();
  bind<IResetPasswordTokensRepository>(ResetPasswordTokensRepositorySid)
    .to(ResetPasswordTokensRepository)
    .inTransientScope();
  bind<IReviewerConfigsRepository>(ReviewerConfigsRepositorySid).to(ReviewerConfigsRepository).inTransientScope();
  bind<IIntegrationsRepository>(IntegrationsRepositorySid).to(IntegrationsRepository).inTransientScope();
  bind<IInteractivePrUserAnalyticsRepository>(InteractivePrUserAnalyticsRepositorySid)
    .to(InteractivePrUserAnalyticsRepository)
    .inTransientScope();
});
