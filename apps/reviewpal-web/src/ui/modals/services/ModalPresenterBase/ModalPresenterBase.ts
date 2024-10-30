import { ResultSource, type IEventAggregator } from '@reviewpal/common/cross-cutting';
import type {
  IModalPresenter,
  ModalPresenterNativeRequestType,
  ModalPresenterNativeResponseType,
} from '@reviewpal/web/ui';
import { ModalPresenterRequestEventName, ModalPresenterResponseEventName } from '@reviewpal/web/ui';
import { Result } from '@vladbasin/ts-result';
import { injectable } from 'inversify';
import { v4 } from 'uuid';

type ModalPresenterConfig = {
  Presenter: string;
  autoHide: boolean;
};

@injectable()
export abstract class ModalPresenterBase<TOptions, TResult> implements IModalPresenter<TOptions, TResult> {
  constructor(config: ModalPresenterConfig, private _eventAggregator: IEventAggregator) {
    this._config = config;

    this._eventAggregator.subscribe(ModalPresenterResponseEventName, (arg) =>
      this.processResponse(arg as ModalPresenterNativeResponseType<TResult>)
    );
  }

  public show(options?: TOptions): string {
    const id = v4();

    this.emitRequest(ModalPresenterRequestEventName, {
      Presenter: this._config.Presenter,
      autoHide: this._config.autoHide,
      id,
      command: 'show',
      options,
    });

    return id;
  }

  public hide(id: string): string {
    this.emitRequest(ModalPresenterRequestEventName, {
      Presenter: this._config.Presenter,
      autoHide: this._config.autoHide,
      id,
      command: 'hide',
    });

    return id;
  }

  public presentAsync(options: TOptions): Result<TResult> {
    const resultSource = new ResultSource<TResult>();

    const id = v4();

    this._awaitingResultIdsToResultSourceMap.set(id, resultSource);

    this.emitRequest(ModalPresenterRequestEventName, {
      Presenter: this._config.Presenter,
      autoHide: this._config.autoHide,
      id,
      command: 'show',
      options,
    });

    return resultSource.getResult();
  }

  private _config: ModalPresenterConfig;

  private _awaitingResultIdsToResultSourceMap = new Map<string, ResultSource<TResult>>();

  private emitRequest(eventName: string, request: ModalPresenterNativeRequestType<TOptions>) {
    return this._eventAggregator.emit(eventName, request);
  }

  private processResponse(response: ModalPresenterNativeResponseType<TResult>): Result<void> {
    const result = Result.Void();

    if (!response.id) {
      return result;
    }

    const resultSource = this._awaitingResultIdsToResultSourceMap.get(response.id);

    if (!resultSource) {
      return result;
    }

    this._awaitingResultIdsToResultSourceMap.delete(response.id);
    resultSource.resolve(response.result as TResult);

    return result;
  }
}
