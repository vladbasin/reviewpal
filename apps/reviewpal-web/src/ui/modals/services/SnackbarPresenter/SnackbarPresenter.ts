import type { IEventAggregator } from '@reviewpal/common/cross-cutting';
import { EventAggregatorSid } from '@reviewpal/common/cross-cutting';
import { SnackbarPresenterSid } from '@reviewpal/web/_sids';
import type { ISnackbarPresenter, SnackbarOptionsType } from '@reviewpal/web/ui';
import { ModalPresenterBase } from '@reviewpal/web/ui';
import { inject } from 'inversify';

export class SnackbarPresenter extends ModalPresenterBase<SnackbarOptionsType, void> implements ISnackbarPresenter {
  constructor(@inject(EventAggregatorSid) eventAggregator: IEventAggregator) {
    super(
      {
        Presenter: SnackbarPresenterSid,
        autoHide: true,
      },
      eventAggregator
    );
  }

  public present(options: SnackbarOptionsType): void {
    this.presentAsync(options).run();
  }
}
