import { HttpClientSid } from '@reviewpal/web/_sids';
import { inject, injectable } from 'inversify';
import { CrudApi, getApiUrl, type IHttpClient } from '@reviewpal/web/data';
import { ApiRoutes } from '@reviewpal/common/api';
import { EmailExistsError, type UserArgsType, type UserAdminApiType } from '@reviewpal/common/users';
import type { Result } from '@vladbasin/ts-result';
import { formatRouteWithParams } from '@reviewpal/web/cross-cutting';

@injectable()
export class UsersAdminApi extends CrudApi<UserAdminApiType, UserArgsType> {
  public constructor(@inject(HttpClientSid) private readonly _httpClient: IHttpClient) {
    super({
      httpClient: _httpClient,
      createOperation: {
        route: ApiRoutes.admin.users.many,
        customErrorsMap: { [EmailExistsError]: 'Email already exists' },
      },
      getOperation: { route: ApiRoutes.admin.users.one },
      listOperation: { route: ApiRoutes.admin.users.many },
      updateOperation: {
        route: ApiRoutes.admin.users.one,
        customErrorsMap: { [EmailExistsError]: 'Email already exists' },
      },
      deleteOperation: { route: ApiRoutes.admin.users.one },
    });
  }

  public requestPasswordResetAsync(userId: string): Result<string> {
    return this._httpClient.sendJsonDataRequestAsync({
      url: getApiUrl(formatRouteWithParams(ApiRoutes.admin.users.requestPasswordReset, { id: userId })),
      method: 'POST',
      withCredentials: true,
    });
  }
}
