import { ContainerModule } from 'inversify';
import {
  ConfirmPresenter,
  FullScreenLoaderPresenter,
  SnackbarPresenter,
  type IConfirmPresenter,
  type IFullScreenLoaderPresenter,
  type ISnackbarPresenter,
} from '@reviewpal/web/ui';
import { ConfirmPresenterSid, FullScreenLoaderPresenterSid, SnackbarPresenterSid } from '@reviewpal/web/_sids';

export const uiModule = new ContainerModule((bind) => {
  bind<IFullScreenLoaderPresenter>(FullScreenLoaderPresenterSid).to(FullScreenLoaderPresenter).inSingletonScope();
  bind<IConfirmPresenter>(ConfirmPresenterSid).to(ConfirmPresenter).inSingletonScope();
  bind<ISnackbarPresenter>(SnackbarPresenterSid).to(SnackbarPresenter).inSingletonScope();
});
