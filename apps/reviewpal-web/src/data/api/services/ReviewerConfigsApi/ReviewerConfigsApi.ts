import { HttpClientSid } from '@reviewpal/web/_sids';
import { inject, injectable } from 'inversify';
import type { IReviewerConfigsAdminApi } from '@reviewpal/web/data';
import { CrudApi, type IHttpClient } from '@reviewpal/web/data';
import { ApiRoutes } from '@reviewpal/common/api';
import type { ReviewerConfigAdminApiType } from '@reviewpal/common/reviewerConfigs';

@injectable()
export class ReviewerConfigsApi extends CrudApi<ReviewerConfigAdminApiType> implements IReviewerConfigsAdminApi {
  public constructor(@inject(HttpClientSid) private readonly _httpClient: IHttpClient) {
    super({
      httpClient: _httpClient,
      getOperation: { route: ApiRoutes.reviewers.one },
      listOperation: { route: ApiRoutes.reviewers.many },
    });
  }
}
