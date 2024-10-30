import type { Result } from '@vladbasin/ts-result';
import type { IModalPresenter } from '../../ModalPresenterBase/contracts/IModalPresenter';
import type { ConfirmOptionsType } from './ConfirmOptionsType';
import type { ConfirmOptionsWithoutActionsType } from './ConfirmOptionsWithoutActionsType';

export interface IConfirmPresenter extends IModalPresenter<ConfirmOptionsType, boolean> {
  presentOkCancelAsync(options: ConfirmOptionsWithoutActionsType): Result<boolean>;
  presentYesNoAsync(options: ConfirmOptionsWithoutActionsType): Result<boolean>;
}
