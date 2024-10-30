import { ConfirmPresenterSid } from '@reviewpal/web/_sids';
import type { IConfirmPresenter } from '@reviewpal/web/ui';
import { useService } from '@reviewpal/web/ui';

export const useConfirmPresenter = () => useService<IConfirmPresenter>(ConfirmPresenterSid);
