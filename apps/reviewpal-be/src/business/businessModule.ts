import { ContainerModule } from 'inversify';
import type {
  ITokenAuthorizer,
  IPasswordAuthorizer,
  IUsersValidator,
  IIntegrationProvider,
  IInteractivePrReviewer,
  IIntegrationsResolver,
  IInteractivePrReviewerAnalyticsProvider,
} from '@reviewpal/be/business';
import {
  BedrockIntegrationProvider,
  GitHubIntegrationProvider,
  IntegrationsResolver,
  InteractivePrReviewer,
  InteractivePrReviewerAnalyticsProvider,
  PasswordAuthorizer,
  TokenAuthorizer,
  UsersValidator,
} from '@reviewpal/be/business';
import {
  IntegrationProviderSid,
  IntegrationsResolverSid,
  InteractivePrReviewerAnalyticsProviderSid,
  InteractivePrReviewerSid,
  PasswordAuthorizerSid,
  TokenAuthorizerSid,
  UsersValidatorSid,
} from '@reviewpal/be/_sids';

export const businessModule = new ContainerModule((bind) => {
  bind<IPasswordAuthorizer>(PasswordAuthorizerSid).to(PasswordAuthorizer).inSingletonScope();
  bind<ITokenAuthorizer>(TokenAuthorizerSid).to(TokenAuthorizer).inSingletonScope();
  bind<IUsersValidator>(UsersValidatorSid).to(UsersValidator).inSingletonScope();

  bind<IIntegrationProvider>(IntegrationProviderSid).to(BedrockIntegrationProvider).inSingletonScope();
  bind<IIntegrationProvider>(IntegrationProviderSid).to(GitHubIntegrationProvider).inSingletonScope();
  bind<IIntegrationsResolver>(IntegrationsResolverSid).to(IntegrationsResolver).inTransientScope();

  bind<IInteractivePrReviewer>(InteractivePrReviewerSid).to(InteractivePrReviewer).inTransientScope();
  bind<IInteractivePrReviewerAnalyticsProvider>(InteractivePrReviewerAnalyticsProviderSid)
    .to(InteractivePrReviewerAnalyticsProvider)
    .inTransientScope();
});
