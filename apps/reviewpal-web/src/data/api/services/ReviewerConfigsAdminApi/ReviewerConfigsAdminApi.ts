import { HttpClientSid } from '@reviewpal/web/_sids';
import { inject, injectable } from 'inversify';
import type { IReviewerConfigsAdminApi } from '@reviewpal/web/data';
import { CrudApi, type IHttpClient } from '@reviewpal/web/data';
import { ApiRoutes } from '@reviewpal/common/api';
import type { ReviewerConfigAdminApiType } from '@reviewpal/common/reviewerConfigs';

@injectable()
export class ReviewerConfigsAdminApi extends CrudApi<ReviewerConfigAdminApiType> implements IReviewerConfigsAdminApi {
  public constructor(@inject(HttpClientSid) private readonly _httpClient: IHttpClient) {
    super({
      httpClient: _httpClient,
      createOperation: { route: ApiRoutes.admin.reviewerConfigs.many },
      getOperation: { route: ApiRoutes.admin.reviewerConfigs.one },
      listOperation: { route: ApiRoutes.admin.reviewerConfigs.many },
      updateOperation: { route: ApiRoutes.admin.reviewerConfigs.one },
      deleteOperation: { route: ApiRoutes.admin.reviewerConfigs.one },
    });
  }
}
