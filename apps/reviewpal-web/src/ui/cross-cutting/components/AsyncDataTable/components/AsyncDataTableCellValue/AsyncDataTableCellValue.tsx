import type { ReactNode } from 'react';
import { useMemo } from 'react';

type AsyncDataTableCellValuePropsType<TItem> = {
  item: TItem;
  valueGetter: keyof TItem | ((item: TItem) => string | ReactNode);
};

export const AsyncDataTableCellValue = <TItem,>({ item, valueGetter }: AsyncDataTableCellValuePropsType<TItem>) => {
  return useMemo(
    () => (typeof valueGetter === 'function' ? valueGetter(item) : item[valueGetter]),
    [item, valueGetter]
  );
};
