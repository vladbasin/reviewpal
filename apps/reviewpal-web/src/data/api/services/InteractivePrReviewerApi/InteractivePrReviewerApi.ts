import { HttpClientSid } from '@reviewpal/web/_sids';
import { inject, injectable } from 'inversify';
import type { IInteractivePrReviewerApi } from '@reviewpal/web/data';
import { getApiUrl, type IHttpClient } from '@reviewpal/web/data';
import { ApiRoutes } from '@reviewpal/common/api';
import type { Result } from '@vladbasin/ts-result';
import { formatRouteWithParams } from '@reviewpal/web/cross-cutting';
import type {
  InteractivePrDiscussArgsType,
  InteractivePrDiscussResultType,
  InteractivePrPublishCommentArgsType,
  InteractivePrReviewArgsType,
  InteractivePrReviewResultType,
} from '@reviewpal/common/reviewers';

@injectable()
export class InteractivePrReviewerApi implements IInteractivePrReviewerApi {
  public constructor(@inject(HttpClientSid) private readonly _httpClient: IHttpClient) {}

  public reviewAsync(args: InteractivePrReviewArgsType): Result<InteractivePrReviewResultType> {
    return this._httpClient.sendJsonDataRequestAsync({
      url: getApiUrl(formatRouteWithParams(ApiRoutes.interactivePrReviewers.review, { id: args.reviewerId })),
      method: 'POST',
      data: args,
      withCredentials: true,
    });
  }

  public discussAsync(args: InteractivePrDiscussArgsType): Result<InteractivePrDiscussResultType> {
    return this._httpClient.sendJsonDataRequestAsync({
      url: getApiUrl(formatRouteWithParams(ApiRoutes.interactivePrReviewers.discuss, { id: args.reviewerId })),
      method: 'POST',
      data: args,
      withCredentials: true,
    });
  }

  public publishCommentAsync(args: InteractivePrPublishCommentArgsType): Result<void> {
    return this._httpClient.sendRawJsonDataRequestAsync({
      url: getApiUrl(formatRouteWithParams(ApiRoutes.interactivePrReviewers.comment, { id: args.reviewerId })),
      method: 'POST',
      data: args,
      withCredentials: true,
    }).void;
  }
}
