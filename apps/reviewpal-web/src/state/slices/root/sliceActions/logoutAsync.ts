import { AuthApiSid } from '@reviewpal/web/_sids';
import { processError } from '@reviewpal/web/cross-cutting';
import type { IAuthApi } from '@reviewpal/web/data';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';
import { createAsyncAction, RootSliceName } from '@reviewpal/web/state';
import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
class Executor implements IAsyncActionExecutor<void> {
  public constructor(@inject(AuthApiSid) private readonly _authApi: IAuthApi) {}

  public executeAsync(): Result<void> {
    return this._authApi.logoutAsync().withProcessedFailError((error) => processError(error));
  }
}

export const logoutAsync = createAsyncAction({
  sliceName: RootSliceName,
  actionName: 'logout',
  Executor: Executor,
});
