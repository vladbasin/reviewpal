import type { AuthorizedUserType, AuthorizeWithPasswordArgsType } from '@reviewpal/common/auth';
import { NotFoundError, UnauthorizedError } from '@reviewpal/common/cross-cutting';
import { AuthApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IAuthApi } from '@reviewpal/web/data';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';
import { createAsyncAction, RootSliceName } from '@reviewpal/web/state';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

const InvalidCredentialsMessage = 'Invalid credentials';

@injectable()
class Executor implements IAsyncActionExecutor<AuthorizedUserType, AuthorizeWithPasswordArgsType> {
  public constructor(@inject(AuthApiSid) private readonly _authApi: IAuthApi) {}

  public executeAsync(args: AuthorizeWithPasswordArgsType): Result<AuthorizedUserType> {
    return this._authApi.authorizeWithPasswordAsync(args).withProcessedFailError((error) =>
      processError(error, {
        [NotFoundError]: InvalidCredentialsMessage,
        [UnauthorizedError]: InvalidCredentialsMessage,
      })
    );
  }
}

export const authorizeWithPasswordAsync = createAsyncAction<AuthorizedUserType, AuthorizeWithPasswordArgsType>({
  sliceName: RootSliceName,
  actionName: 'authorizeWithPassword',
  Executor,
});
