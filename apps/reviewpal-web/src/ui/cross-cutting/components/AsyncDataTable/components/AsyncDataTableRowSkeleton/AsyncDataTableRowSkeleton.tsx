import { Skeleton, TableCell, TableRow } from '@mui/material';
import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { AsyncDataTableColumnType } from '@reviewpal/web/ui';
import { useMemo } from 'react';

type AsyncDataTableRowSkeletonPropsType<T extends IdentifiableType> = {
  repeat: number;
  columns: AsyncDataTableColumnType<T>[];
};

export const AsyncDataTableRowSkeleton = <T extends IdentifiableType>({
  repeat,
  columns,
}: AsyncDataTableRowSkeletonPropsType<T>) => {
  const repeatArray = useMemo(() => Array.from({ length: repeat }).fill(0), [repeat]);

  return repeatArray.map((_, index) => (
    <TableRow key={index}>
      {columns.map(({ title }, index) => (
        <TableCell key={`${title}-${index}`}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  ));
};
