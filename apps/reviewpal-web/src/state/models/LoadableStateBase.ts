import type { LoadableStateType } from '@reviewpal/web/state';
import type { Maybe } from '@vladbasin/ts-types';
import type { Draft } from 'immer';
import { produce } from 'immer';

export abstract class LoadableStateBase<TValue, TState extends LoadableStateType> {
  public constructor(state: TState) {
    this._state = state;
  }

  public startLoading(): TState {
    return produce(this._state, (draft) => {
      draft.status = 'loading';
      draft.error = undefined;
      this.setValue(draft);
    });
  }

  public failLoading(error: Maybe<string>): TState {
    return produce(this._state, (draft) => {
      draft.status = 'error';
      draft.error = error;
      this.setValue(draft, undefined);
    });
  }

  public finishLoading(value: TValue): TState {
    return produce(this._state, (draft) => {
      draft.status = 'success';
      draft.error = undefined;
      this.setValue(draft, value);
    });
  }

  protected _state: TState;
  protected abstract setValue(draft: Draft<TState>, value?: TValue): void;

  protected static createInitialLoadableState(): LoadableStateType {
    return {
      status: 'idle',
      error: undefined,
    };
  }
}
