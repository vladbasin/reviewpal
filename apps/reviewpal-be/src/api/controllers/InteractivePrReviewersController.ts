import { inject, injectable } from 'inversify';
import type { SuccessHandleResult } from '@reviewpal/be/api';
import { handleApiRequestAsync, requireAuth, type IController } from '@reviewpal/be/api';
import type { RequestHandler, Router } from 'express';
import { ApiRoutes } from '@reviewpal/common/api';
import { InteractivePrReviewerSid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import type { IInteractivePrReviewer, ITokenAuthorizer } from '@reviewpal/be/business';
import { HttpStatusCode } from 'axios';

@injectable()
export class InteractivePrReviewersController implements IController {
  public constructor(
    @inject(InteractivePrReviewerSid) private readonly _interactivePrReviewer: IInteractivePrReviewer,
    @inject(TokenAuthorizerSid) private readonly _tokenAuthorizer: ITokenAuthorizer
  ) {}

  public register(router: Router): void {
    router.post(ApiRoutes.interactivePrReviewers.review, requireAuth(this._tokenAuthorizer), this.review());
    router.post(ApiRoutes.interactivePrReviewers.discuss, requireAuth(this._tokenAuthorizer), this.discuss());
    router.post(ApiRoutes.interactivePrReviewers.comment, requireAuth(this._tokenAuthorizer), this.publishComment());
  }

  private review(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) =>
        this._interactivePrReviewer
          .reviewAsync({ ...req.body, reviewerId: req.params.id, userId: req.user?.id ?? '' })
          .onSuccess((result): SuccessHandleResult => ({ statusCode: HttpStatusCode.Ok, data: result })),
    });
  }

  private discuss(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) =>
        this._interactivePrReviewer
          .discussAsync({ ...req.body, reviewerId: req.params.id, userId: req.user?.id ?? '' })
          .onSuccess((result): SuccessHandleResult => ({ statusCode: HttpStatusCode.Ok, data: result })),
    });
  }

  private publishComment(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) =>
        this._interactivePrReviewer.publishCommentAsync({
          ...req.body,
          reviewerId: req.params.id,
          userId: req.user?.id ?? '',
          userName: req.user?.name ?? '',
        }),
    });
  }
}
