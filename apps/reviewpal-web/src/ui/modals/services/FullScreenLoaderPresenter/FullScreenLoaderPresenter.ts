import { inject, injectable } from 'inversify';
import type { IFullScreenLoaderPresenter } from '@reviewpal/web/ui';
import { ModalPresenterBase } from '@reviewpal/web/ui';
import type { IEventAggregator } from '@reviewpal/common/cross-cutting';
import { EventAggregatorSid } from '@reviewpal/common/cross-cutting';
import { FullScreenLoaderPresenterSid } from '@reviewpal/web/_sids';

@injectable()
export class FullScreenLoaderPresenter extends ModalPresenterBase<void, void> implements IFullScreenLoaderPresenter {
  constructor(@inject(EventAggregatorSid) eventAggregator: IEventAggregator) {
    super(
      {
        Presenter: FullScreenLoaderPresenterSid,
        autoHide: false,
      },
      eventAggregator
    );
  }
}
