import type { SnackbarOptionsType } from '@reviewpal/web/ui';

export interface ISnackbarPresenter {
  present(options: SnackbarOptionsType): void;
}
