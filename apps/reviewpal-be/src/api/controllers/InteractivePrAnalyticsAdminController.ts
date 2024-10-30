import {
  TokenAuthorizerSid,
  InteractivePrUserAnalyticsRepositorySid,
  InteractivePrReviewerAnalyticsProviderSid,
} from '@reviewpal/be/_sids';
import type { CrudControllerOperationType, SuccessHandleResult } from '@reviewpal/be/api';
import {
  CrudControllerBase,
  handleApiRequestAsync,
  mapUserEntityToAdminApiItem,
  requireAuth,
  type IController,
} from '@reviewpal/be/api';
import type { IInteractivePrReviewerAnalyticsProvider, ITokenAuthorizer } from '@reviewpal/be/business';
import type {
  IInteractivePrUserAnalyticsRepository,
  InteractivePrUserAnalyticsEntity,
  IRepositoryBase,
} from '@reviewpal/be/data';
import { ApiRoutes } from '@reviewpal/common/api';
import type { InteractivePrUserAnalyticsAdminApiType } from '@reviewpal/common/reviewers';
import { Result } from '@vladbasin/ts-result';
import { HttpStatusCode } from 'axios';
import type { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class InteractivePrAnalyticsAdminController
  extends CrudControllerBase<InteractivePrUserAnalyticsEntity, InteractivePrUserAnalyticsAdminApiType>
  implements IController
{
  public constructor(
    @inject(InteractivePrUserAnalyticsRepositorySid)
    private readonly _interactivePrUserAnalyticsRepository: IInteractivePrUserAnalyticsRepository,
    @inject(TokenAuthorizerSid) protected readonly _tokenAuthorizer: ITokenAuthorizer,
    @inject(InteractivePrReviewerAnalyticsProviderSid)
    private readonly _interactivePrReviewerAnalyticsProvider: IInteractivePrReviewerAnalyticsProvider
  ) {
    super(_tokenAuthorizer);
  }

  public register(router: Router): void {
    super.register(router);

    router.get(
      ApiRoutes.admin.interactivePrAnalytics.summary,
      requireAuth(this._tokenAuthorizer, ['admin']),
      this.provideSummary()
    );
  }

  public provideSummary(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: () =>
        this._interactivePrReviewerAnalyticsProvider
          .provideSummaryAsync()
          .onSuccess((result): SuccessHandleResult => ({ statusCode: HttpStatusCode.Ok, data: result })),
    });
  }

  protected get repository(): IRepositoryBase<InteractivePrUserAnalyticsEntity> {
    return this._interactivePrUserAnalyticsRepository;
  }

  protected listOperation: CrudControllerOperationType = {
    auth: ['admin'],
    route: ApiRoutes.admin.interactivePrAnalytics.many,
  };
  protected createOperation = undefined;
  protected getOperation = undefined;
  protected updateOperation = undefined;
  protected deleteOperation = undefined;

  protected mapEntityToApiItemAsync({
    id,
    userId,
    reviews,
    codeSuggestions,
    publishedComments,
    discussions,
    inputTokens,
    outputTokens,
    user,
  }: InteractivePrUserAnalyticsEntity): Result<InteractivePrUserAnalyticsAdminApiType> {
    if (!user) {
      return Result.Fail('User must be provided');
    }

    return Result.Ok({
      id,
      userId,
      reviews,
      codeSuggestions,
      publishedComments,
      discussions,
      inputTokens,
      outputTokens,
      user: mapUserEntityToAdminApiItem(user),
    });
  }
}
