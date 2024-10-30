import type { AuthorizedUserType } from '@reviewpal/common/auth';
import type { LoadableStateType } from '@reviewpal/web/state';
import { LoadableStateBase } from '@reviewpal/web/state';
import type { Maybe } from '@vladbasin/ts-types';
import { produce, type Draft } from 'immer';

export type RootStateType = LoadableStateType & {
  currentUser?: AuthorizedUserType;
};

export class RootState extends LoadableStateBase<Maybe<AuthorizedUserType>, RootStateType> {
  public setCurrentUser(user: Maybe<AuthorizedUserType>) {
    return produce(this._state, (draft) => {
      this.setValue(draft, user);
    });
  }

  public static createInitialState(): RootStateType {
    return {
      ...super.createInitialLoadableState(),
      currentUser: undefined,
    };
  }

  protected setValue(draft: Draft<RootStateType>, value?: Maybe<AuthorizedUserType>): void {
    draft.currentUser = value;
  }
}
