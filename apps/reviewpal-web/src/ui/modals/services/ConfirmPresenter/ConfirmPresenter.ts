import type { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';
import type { IEventAggregator } from '@reviewpal/common/cross-cutting';
import { EventAggregatorSid } from '@reviewpal/common/cross-cutting';
import type { ConfirmOptionsType, ConfirmOptionsWithoutActionsType, IConfirmPresenter } from '@reviewpal/web/ui';
import { ModalPresenterBase } from '@reviewpal/web/ui';
import { ConfirmPresenterSid } from '@reviewpal/web/_sids';

@injectable()
export class ConfirmPresenter extends ModalPresenterBase<ConfirmOptionsType, boolean> implements IConfirmPresenter {
  constructor(@inject(EventAggregatorSid) eventAggregator: IEventAggregator) {
    super(
      {
        Presenter: ConfirmPresenterSid,
        autoHide: true,
      },
      eventAggregator
    );
  }

  public presentOkCancelAsync(options: ConfirmOptionsWithoutActionsType): Result<boolean> {
    return this.presentAsync({
      ...options,
      title: 'Confirmation',
      confirm: 'Ok',
      reject: 'Cancel',
    });
  }

  public presentYesNoAsync(options: ConfirmOptionsWithoutActionsType): Result<boolean> {
    return this.presentAsync({
      ...options,
      title: 'Confirmation',
      confirm: 'Yes',
      reject: 'No',
    });
  }
}
