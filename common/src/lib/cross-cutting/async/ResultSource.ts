import { Result } from '@vladbasin/ts-result';

export class ResultSource<T> {
  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    this._result = Result.FromPromise(this._promise);
  }

  public resolve(value: T): ResultSource<T> {
    this._resolve(value);
    return this;
  }

  public reject(reason: string): ResultSource<T> {
    this._reject(reason);
    return this;
  }

  public getResult() {
    return this._result;
  }

  private _promise: Promise<T>;

  private _resolve: (value: T) => void = () => undefined;

  private _reject: (reason?: unknown) => void = () => undefined;

  private _result: Result<T>;
}
