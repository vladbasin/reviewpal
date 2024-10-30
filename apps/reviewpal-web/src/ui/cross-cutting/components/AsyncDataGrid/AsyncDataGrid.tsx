import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';
import type { AsyncListLoadOptionsType, AsyncListResultType } from '@reviewpal/web/ui';
import {
  asyncDataGridContainerStyle,
  AsyncDataGridItemSkeleton,
  useAsyncList,
  AsyncDataGridItem,
} from '@reviewpal/web/ui';
import type { Result } from '@vladbasin/ts-result';
import type { ChangeEvent } from 'react';
import { useCallback, useState, useRef } from 'react';
import { Alert, Box, Stack, TextField } from '@mui/material';

type AsyncDataGridPropsType<TItem extends IdentifiableType> = {
  dataLoader: (
    currentResult: Maybe<AsyncListResultType<TItem>>,
    options: AsyncListLoadOptionsType
  ) => Result<AsyncListResultType<TItem>>;
  titleGetter: keyof TItem;
  subtitleGetter: keyof TItem;
  onItemClick?: (item: TItem) => void;
};

export const AsyncDataGrid = <TItem extends IdentifiableType>({
  dataLoader,
  titleGetter,
  subtitleGetter,
  onItemClick,
}: AsyncDataGridPropsType<TItem>) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>('');
  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value), []);

  const { error, data, isLoadingMore, isFirstTimeLoading, hasError, hasNoData, isSearchReady, isDataDisplayable } =
    useAsyncList({
      dataLoader,
      listBottomRef: bottomRef,
      query,
    });

  return (
    <>
      <Stack direction="column" spacing={2}>
        {hasError && <Alert severity="error">{error?.message}</Alert>}
        {isSearchReady && <TextField placeholder="Search..." value={query} onChange={onQueryChange} />}
        {hasNoData && <Alert severity="info">No data yet</Alert>}
        {isDataDisplayable && (
          <Box sx={asyncDataGridContainerStyle}>
            {isFirstTimeLoading ? (
              <AsyncDataGridItemSkeleton repeat={6} />
            ) : (
              data?.list.map((item) => (
                <AsyncDataGridItem
                  key={item.id}
                  title={String(item[titleGetter])}
                  subtitle={String(item[subtitleGetter])}
                  onClick={() => onItemClick?.(item)}
                />
              ))
            )}
            {isLoadingMore && <AsyncDataGridItemSkeleton repeat={1} />}
          </Box>
        )}
      </Stack>
      <Box ref={bottomRef} />
    </>
  );
};
