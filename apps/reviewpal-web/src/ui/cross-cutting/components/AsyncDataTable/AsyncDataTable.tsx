import type { TableSortLabelProps } from '@mui/material';
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import type { IdentifiableType, OrderDirectionType } from '@reviewpal/common/cross-cutting';
import type {
  AsyncDataTableColumnType,
  AsyncDataTableFooterOptionsType,
  AsyncListLoadOptionsType,
  AsyncListResultType,
} from '@reviewpal/web/ui';
import {
  AsyncDataTableCellValue,
  asyncDataTableHeaderCellStyle,
  AsyncDataTableRowSkeleton,
  asyncDataTableRowStyle,
  useAsyncList,
} from '@reviewpal/web/ui';
import type { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import type { ChangeEvent, ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { isNil } from 'lodash';

type AsyncDataTablePropsType<TItem extends IdentifiableType> = {
  columns: AsyncDataTableColumnType<TItem>[];
  dataLoader: (
    currentResult: Maybe<AsyncListResultType<TItem>>,
    options: AsyncListLoadOptionsType
  ) => Result<AsyncListResultType<TItem>>;
  onItemClick?: (item: TItem) => void;
  footer?: (options: AsyncDataTableFooterOptionsType<TItem>) => ReactNode;
  isSearchable?: boolean;
};

export const AsyncDataTable = <TItem extends IdentifiableType>({
  columns,
  dataLoader,
  onItemClick,
  footer,
  isSearchable = true,
}: AsyncDataTablePropsType<TItem>) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>('');
  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value), []);

  const defaultOrderBy = useMemo(() => columns.find((column) => column.isDefaultOrder)?.orderableBy, [columns]);

  const [orderBy, setOrderBy] = useState<Maybe<string>>();
  const [orderDirection, setOrderDirection] = useState<Maybe<OrderDirectionType>>();

  const {
    error,
    data,
    isLoadingMore,
    isFirstTimeLoading,
    hasError,
    hasNoData,
    isSearchReady,
    isDataDisplayable,
    reload,
    mutate,
  } = useAsyncList({
    dataLoader,
    listBottomRef: bottomRef,
    query,
    orderBy: orderBy ?? defaultOrderBy,
    orderDirection,
  });

  const handleItemEdited = useCallback(
    (item?: TItem) =>
      item
        ? mutate((data) => {
            if (!data) {
              return;
            }
            return { ...data, list: data.list.map((t) => (t.id === item.id ? item : t)) };
          })
        : reload(),
    [reload, mutate]
  );
  const handleItemDeleted = useCallback(
    (item: TItem) =>
      mutate((data) => {
        if (!data) {
          return;
        }
        return { ...data, list: data.list.filter((t) => t.id !== item.id) };
      }),
    [mutate]
  );
  const footerNode = useMemo(
    () => footer?.({ onEdit: handleItemEdited, onDelete: handleItemDeleted }),
    [handleItemEdited, handleItemDeleted, footer]
  );

  const shouldShowSearch = useMemo(() => isSearchable && isSearchReady, [isSearchable, isSearchReady]);

  const setOrderColumn = useCallback(
    (column: AsyncDataTableColumnType<TItem>) => {
      if (column.orderableBy !== orderBy) {
        setOrderBy(column.orderableBy);
        setOrderDirection('ASC');
      } else {
        setOrderDirection(orderDirection === 'DESC' ? undefined : 'DESC');
        setOrderBy(orderDirection === 'DESC' ? undefined : column.orderableBy);
      }
    },
    [orderBy, orderDirection]
  );

  return (
    <TableContainer>
      <Stack direction="column" spacing={2}>
        {hasError && <Alert severity="error">{error?.message}</Alert>}
        {shouldShowSearch && <TextField placeholder="Search..." value={query} onChange={onQueryChange} />}
        {hasNoData && <Alert severity="info">No data yet</Alert>}
        {isDataDisplayable && (
          <Table stickyHeader>
            <TableHead>
              {isFirstTimeLoading ? (
                <AsyncDataTableRowSkeleton columns={columns} repeat={1} />
              ) : (
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={`${column.title}-${index}`} sx={asyncDataTableHeaderCellStyle}>
                      {isNil(column.orderableBy) ? (
                        column.title
                      ) : (
                        <TableSortLabel
                          active={orderBy === column.orderableBy}
                          direction={orderDirection?.toLowerCase() as TableSortLabelProps['direction']}
                          onClick={() => setOrderColumn(column)}
                        >
                          {column.title}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {isFirstTimeLoading ? (
                <AsyncDataTableRowSkeleton columns={columns} repeat={5} />
              ) : (
                data?.list.map((item) => (
                  <TableRow key={item.id} hover sx={asyncDataTableRowStyle} onClick={() => onItemClick?.(item)}>
                    {columns.map(({ title, valueGetter }, index) => (
                      <TableCell key={`${title}-${index}`}>
                        <AsyncDataTableCellValue item={item} valueGetter={valueGetter} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
              {isLoadingMore && (
                <TableRow>
                  {columns.map(({ title }, index) => (
                    <TableCell key={`${title}-${index}`}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Stack>
      <Box ref={bottomRef} />
      {footerNode}
    </TableContainer>
  );
};
