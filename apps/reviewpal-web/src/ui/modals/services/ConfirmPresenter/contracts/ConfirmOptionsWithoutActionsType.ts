import type { ConfirmOptionsType } from './ConfirmOptionsType';

export type ConfirmOptionsWithoutActionsType = Omit<ConfirmOptionsType, 'confirm' | 'reject' | 'title'>;
