import { ApiRoutes } from '@reviewpal/common/api';
import type { AuthorizedUserType, AuthorizeWithPasswordArgsType, ResetPasswordArgsType } from '@reviewpal/common/auth';
import { HttpClientSid } from '@reviewpal/web/_sids';
import { formatRouteWithParams } from '@reviewpal/web/cross-cutting';
import type { IAuthApi, IHttpClient } from '@reviewpal/web/data';
import { getApiUrl } from '@reviewpal/web/data';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthApi implements IAuthApi {
  public constructor(@inject(HttpClientSid) private _httpClient: IHttpClient) {}

  public authorizeWithPasswordAsync(args: AuthorizeWithPasswordArgsType): Result<AuthorizedUserType> {
    return this._httpClient.sendJsonDataRequestAsync({
      url: getApiUrl(ApiRoutes.auth.session),
      method: 'POST',
      withCredentials: true,
      data: {
        email: args.email,
        password: args.password,
      },
    });
  }

  public refreshSessionAsync(): Result<AuthorizedUserType> {
    return this._httpClient.sendJsonDataRequestAsync({
      url: getApiUrl(ApiRoutes.auth.session),
      method: 'PUT',
      withCredentials: true,
    });
  }

  public logoutAsync(): Result<void> {
    return this._httpClient.sendRawJsonDataRequestAsync({
      url: getApiUrl(ApiRoutes.auth.session),
      method: 'DELETE',
      withCredentials: true,
    }).void;
  }

  public resetPasswordAsync(args: ResetPasswordArgsType): Result<void> {
    return this._httpClient.sendRawJsonDataRequestAsync({
      url: getApiUrl(formatRouteWithParams(ApiRoutes.auth.resetPassword, { token: args.token })),
      method: 'POST',
      withCredentials: true,
      data: args,
    }).void;
  }
}
