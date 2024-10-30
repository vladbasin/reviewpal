import { ContainerModule } from 'inversify';
import {
  AuthApiSid,
  HttpClientSid,
  IntegrationsAdminApiSid,
  ReviewerConfigsAdminApiSid,
  ReviewerConfigsApiSid,
  UsersAdminApiSid,
  InteractivePrReviewerApiSid,
  InteractivePrAnalyticsAdminApiSid,
} from '@reviewpal/web/_sids';
import type {
  IAuthApi,
  IIntegrationsAdminApi,
  IInteractivePrAnalyticsAdminApi,
  IInteractivePrReviewerApi,
  IReviewerConfigsAdminApi,
  IReviewerConfigsApi,
  IUsersAdminApi,
  IHttpClient,
} from '@reviewpal/web/data';
import {
  AuthApi,
  HttpClient,
  IntegrationsAdminApi,
  InteractivePrReviewerApi,
  ReviewerConfigsAdminApi,
  ReviewerConfigsApi,
  UsersAdminApi,
  InteractivePrAnalyticsAdminApi,
} from '@reviewpal/web/data';

export const dataModule = new ContainerModule((bind) => {
  bind<IHttpClient>(HttpClientSid).to(HttpClient).inSingletonScope();
  bind<IAuthApi>(AuthApiSid).to(AuthApi).inSingletonScope();
  bind<IUsersAdminApi>(UsersAdminApiSid).to(UsersAdminApi).inSingletonScope();
  bind<IIntegrationsAdminApi>(IntegrationsAdminApiSid).to(IntegrationsAdminApi).inSingletonScope();
  bind<IReviewerConfigsAdminApi>(ReviewerConfigsAdminApiSid).to(ReviewerConfigsAdminApi).inSingletonScope();
  bind<IReviewerConfigsApi>(ReviewerConfigsApiSid).to(ReviewerConfigsApi).inSingletonScope();
  bind<IInteractivePrReviewerApi>(InteractivePrReviewerApiSid).to(InteractivePrReviewerApi).inSingletonScope();
  bind<IInteractivePrAnalyticsAdminApi>(InteractivePrAnalyticsAdminApiSid)
    .to(InteractivePrAnalyticsAdminApi)
    .inSingletonScope();
});
