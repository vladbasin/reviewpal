import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { asyncDataGridItemSkeletonStyle } from '@reviewpal/web/ui';

type AsyncDataGridItemSkeletonPropsType = {
  repeat: number;
};

export const AsyncDataGridItemSkeleton = ({ repeat }: AsyncDataGridItemSkeletonPropsType) => {
  const repeatArray = useMemo(() => Array(repeat).fill(1), [repeat]);

  return (
    <>
      {repeatArray.map((_, index) => (
        <Skeleton key={index} sx={asyncDataGridItemSkeletonStyle} />
      ))}
    </>
  );
};
