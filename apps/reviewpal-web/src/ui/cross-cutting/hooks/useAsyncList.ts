import type { IdentifiableType, OrderDirectionType } from '@reviewpal/common/cross-cutting';
import type { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import { useDebounce, useDebounceEffect, useInfiniteScroll, useInViewport, useThrottle } from 'ahooks';
import { isEqual, isNil } from 'lodash';
import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type AsyncListResultType<TItem extends IdentifiableType> = {
  list: TItem[];
  hasMore: boolean;
  query?: string;
  orderBy?: string;
  orderDirection?: OrderDirectionType;
};

export type AsyncListLoadOptionsType = {
  query?: string;
  orderBy?: string;
  orderDirection?: OrderDirectionType;
};

export type AsyncListOptionsType<TItem extends IdentifiableType> = {
  dataLoader: (
    currentData: Maybe<AsyncListResultType<TItem>>,
    options: AsyncListLoadOptionsType
  ) => Result<AsyncListResultType<TItem>>;
  query?: string;
  orderBy?: string;
  orderDirection?: OrderDirectionType;
  listBottomRef?: RefObject<HTMLDivElement>;
};

const QueryThrottleWait = 500;
const ShouldLoadMoreDebounceWait = 100;
const ShouldReloadDebounceWait = 500;

export const useAsyncList = <TItem extends IdentifiableType>({
  dataLoader,
  query,
  orderBy,
  orderDirection,
  listBottomRef,
}: AsyncListOptionsType<TItem>) => {
  const [hasLoadingError, setHasLoadingError] = useState(false);

  const infiniteScrollSource = useCallback(
    (currentData?: AsyncListResultType<TItem>) =>
      dataLoader(currentData, { query, orderBy, orderDirection })
        .onFailure(() => setHasLoadingError(true))
        .asPromise(),
    [dataLoader, query, orderBy, orderDirection]
  );
  const { loading, loadingMore, error, data, loadMore, reload, mutate } = useInfiniteScroll(infiniteScrollSource, {
    isNoMore: (data) => data?.hasMore === false,
  });

  const [isBottomInViewport] = useInViewport(listBottomRef);
  const shouldLoadMore = useDebounce(isBottomInViewport && data?.hasMore === true && !loadingMore && !loading, {
    wait: ShouldLoadMoreDebounceWait,
    trailing: true,
  });
  useEffect(() => {
    if (shouldLoadMore) {
      loadMore();
    }
  }, [shouldLoadMore, loadMore]);

  const throttledQuery = useThrottle(query, { wait: QueryThrottleWait, trailing: true });
  useDebounceEffect(
    () => {
      const expectedData = { query: throttledQuery, orderBy, orderDirection };
      const currentData = { query: data?.query, orderBy: data?.orderBy, orderDirection: data?.orderDirection };
      const shouldReload = !isEqual(expectedData, currentData) && !loading && !loadingMore && !hasLoadingError;
      if (shouldReload) {
        reload();
      }
    },
    [
      throttledQuery,
      query,
      orderBy,
      orderDirection,
      data?.query,
      data?.orderBy,
      data?.orderDirection,
      loading,
      loadingMore,
    ],
    { wait: ShouldReloadDebounceWait, trailing: true }
  );

  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  useEffect(() => setIsFirstTimeLoading((t) => (!t ? t : loading)), [loading]);

  const hasNoData = useMemo(() => isNil(error) && !isNil(data) && data.list.length === 0, [error, data]);
  const hasError = useMemo(() => !isNil(error), [error]);
  const isDataDisplayable = useMemo(
    () => !hasError && (!hasNoData || isFirstTimeLoading),
    [hasError, isFirstTimeLoading, hasNoData]
  );
  const isSearchReady = useMemo(() => !hasError, [hasError]);

  return useMemo(
    () => ({
      isFirstTimeLoading,
      isLoading: loading,
      isLoadingMore: loadingMore,
      error,
      data,
      hasError,
      hasNoData,
      isSearchReady,
      isDataDisplayable,
      reload,
      mutate,
    }),
    [
      isFirstTimeLoading,
      loading,
      loadingMore,
      error,
      data,
      hasError,
      hasNoData,
      isSearchReady,
      isDataDisplayable,
      reload,
      mutate,
    ]
  );
};
