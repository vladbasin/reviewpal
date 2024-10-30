import type { Result } from '@vladbasin/ts-result';

export interface IModalPresenter<TOptions, TResult> {
  show(options?: TOptions): string;
  hide(id: string): string;
  presentAsync(options: TOptions): Result<TResult>;
}
