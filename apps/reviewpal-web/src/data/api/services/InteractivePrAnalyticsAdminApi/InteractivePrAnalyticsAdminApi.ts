import { HttpClientSid } from '@reviewpal/web/_sids';
import { inject, injectable } from 'inversify';
import type { IInteractivePrAnalyticsAdminApi } from '@reviewpal/web/data';
import { CrudApi, getApiUrl, type IHttpClient } from '@reviewpal/web/data';
import { ApiRoutes } from '@reviewpal/common/api';
import type {
  InteractivePrReviewerAnalyticsSummaryType,
  InteractivePrUserAnalyticsAdminApiType,
} from '@reviewpal/common/reviewers';
import type { Result } from '@vladbasin/ts-result';

@injectable()
export class InteractivePrAnalyticsAdminApi
  extends CrudApi<InteractivePrUserAnalyticsAdminApiType>
  implements IInteractivePrAnalyticsAdminApi
{
  public constructor(@inject(HttpClientSid) private readonly _httpClient: IHttpClient) {
    super({
      httpClient: _httpClient,
      listOperation: { route: ApiRoutes.admin.interactivePrAnalytics.many },
    });
  }

  public provideSummaryAsync(): Result<InteractivePrReviewerAnalyticsSummaryType> {
    return this._httpClient.sendJsonDataRequestAsync<InteractivePrReviewerAnalyticsSummaryType>({
      url: getApiUrl(ApiRoutes.admin.interactivePrAnalytics.summary),
      method: 'GET',
      withCredentials: true,
    });
  }
}
