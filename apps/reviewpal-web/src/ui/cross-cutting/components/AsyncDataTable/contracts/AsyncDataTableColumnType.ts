import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { ReactNode } from 'react';

export type AsyncDataTableColumnType<TItem extends IdentifiableType> = {
  title: string;
  valueGetter: keyof TItem | ((item: TItem) => string | ReactNode);
  orderableBy?: string;
  isDefaultOrder?: boolean;
};
