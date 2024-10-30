import { PasswordAuthorizerSid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import type { SuccessHandleResult } from '@reviewpal/be/api';
import {
  AccessTokenCookieName,
  clearAuthCookies,
  handleApiRequestAsync,
  RefreshTokenCookieName,
  setAuthCookies,
  type IController,
} from '@reviewpal/be/api';
import type { AuthorizedWithTokenResultType, IPasswordAuthorizer, ITokenAuthorizer } from '@reviewpal/be/business';
import { ApiRoutes } from '@reviewpal/common/api';
import type { ResetPasswordArgsType } from '@reviewpal/common/auth';
import { ResetPasswordArgsTypeSchema } from '@reviewpal/common/auth';
import { CodedError, UnauthorizedError, validateSchemaEarlyAsync } from '@reviewpal/common/cross-cutting';
import { Result } from '@vladbasin/ts-result';
import { HttpStatusCode } from 'axios';
import type { RequestHandler, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthController implements IController {
  public constructor(
    @inject(PasswordAuthorizerSid) private readonly _passwordAuthorizer: IPasswordAuthorizer,
    @inject(TokenAuthorizerSid) private readonly _tokenAuthorizer: ITokenAuthorizer
  ) {}

  public register(router: Router): void {
    router
      .post(ApiRoutes.auth.session, this.authorizeWithPassword())
      .put(ApiRoutes.auth.session, this.authorizeTokens())
      .delete(ApiRoutes.auth.session, this.logout())
      .post(ApiRoutes.auth.resetPassword, this.resetPasswordAsync());
  }

  private authorizeWithPassword(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req, res) =>
        this._passwordAuthorizer
          .authorizeAsync({ email: req.body.email, password: req.body.password })
          .onSuccess((result) => this.sendSuccessAuthResponse(req, res, result)),
    });
  }

  private authorizeTokens(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req, res) =>
        this._tokenAuthorizer
          .authorizeTokensAsync(req.cookies[AccessTokenCookieName], req.cookies[RefreshTokenCookieName])
          .withProcessedFailError(
            (error) => new CodedError({ code: UnauthorizedError, message: 'Validation failed', originalError: error })
          )
          .onSuccess((result) => this.sendSuccessAuthResponse(req, res, result)),
    });
  }

  private logout(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req, res) =>
        this._tokenAuthorizer
          .logoutAsync(req.cookies[AccessTokenCookieName], req.cookies[RefreshTokenCookieName])
          .recover()
          .onSuccess(() => clearAuthCookies(res))
          .onSuccess((): SuccessHandleResult => ({ statusCode: HttpStatusCode.NoContent })),
    });
  }

  private resetPasswordAsync() {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: (req) =>
        Result.Ok(req.body as ResetPasswordArgsType)
          .onSuccessExecute((args) => validateSchemaEarlyAsync(args, ResetPasswordArgsTypeSchema, true))
          .onSuccess((args) => this._passwordAuthorizer.resetPasswordAsync(args))
          .onSuccess((): SuccessHandleResult => ({ statusCode: HttpStatusCode.NoContent })),
    });
  }

  private sendSuccessAuthResponse(
    req: Request,
    res: Response,
    { accessToken, refreshToken, user }: AuthorizedWithTokenResultType
  ): SuccessHandleResult {
    setAuthCookies(req, res, accessToken, refreshToken);
    return { statusCode: HttpStatusCode.Ok, data: user };
  }
}
