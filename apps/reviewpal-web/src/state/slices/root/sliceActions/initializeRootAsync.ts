import type { AuthorizedUserType } from '@reviewpal/common/auth';
import { UnauthorizedError } from '@reviewpal/common/cross-cutting';
import { AuthApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IAuthApi } from '@reviewpal/web/data';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';
import { createAsyncAction, RootSliceName } from '@reviewpal/web/state';
import { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import { inject, injectable } from 'inversify';

@injectable()
class Executor implements IAsyncActionExecutor<Maybe<AuthorizedUserType>> {
  public constructor(@inject(AuthApiSid) private readonly _authApi: IAuthApi) {}

  public executeAsync(): Result<Maybe<AuthorizedUserType>> {
    return this._authApi
      .refreshSessionAsync()
      .onSuccess((currentUser) => Result.Ok<Maybe<AuthorizedUserType>>(currentUser))
      .onFailureCompensateWithError((error) =>
        error.message === UnauthorizedError ? Result.Ok(undefined) : Result.FailWithError(error)
      )
      .withProcessedFailError((error) => processError(error));
  }
}

export const initializeRootAsync = createAsyncAction<Maybe<AuthorizedUserType>>({
  sliceName: RootSliceName,
  actionName: 'initializeRoot',
  Executor,
});
