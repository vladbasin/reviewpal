import { SnackbarPresenterSid } from '@reviewpal/web/_sids';
import type { ISnackbarPresenter } from '@reviewpal/web/ui';
import { useService } from '@reviewpal/web/ui';

export const useSnackbarPresenter = () => useService<ISnackbarPresenter>(SnackbarPresenterSid);
