import type { Result } from '@vladbasin/ts-result';

export interface IAsyncActionExecutor<TResult = void, TArgs = void> {
  executeAsync: TArgs extends void ? () => Result<TResult> : (args: TArgs) => Result<TResult>;
}
