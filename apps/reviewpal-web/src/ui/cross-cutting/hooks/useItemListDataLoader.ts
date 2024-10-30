import type { IdentifiableType, ItemListArgsType } from '@reviewpal/common/cross-cutting';
import { DefaultPageSizeProcessConfig } from '@reviewpal/web/cross-cutting';
import type { AsyncListLoadOptionsType, AsyncListResultType } from '@reviewpal/web/ui';
import type { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import { useCallback } from 'react';

type UseCrudDataLoaderOptionsType<TTarget extends IdentifiableType> = {
  listAsync: (args: ItemListArgsType<TTarget>) => Result<TTarget[]>;
  searchFields?: string[];
  withDeleted?: boolean;
};

export const useItemListDataLoader = <TTarget extends IdentifiableType>({
  listAsync,
  searchFields,
  withDeleted,
}: UseCrudDataLoaderOptionsType<TTarget>) => {
  return useCallback(
    (
      currentResult: Maybe<AsyncListResultType<TTarget>>,
      { query, orderBy, orderDirection }: AsyncListLoadOptionsType
    ): Result<AsyncListResultType<TTarget>> =>
      listAsync({
        query,
        searchFields,
        skip: currentResult?.list.length,
        take: DefaultPageSizeProcessConfig,
        orderBy,
        orderDirection,
        withRelations: true,
        withDeleted,
      }).onSuccess((loadedItems) => ({
        list: loadedItems,
        hasMore: loadedItems.length > 0 && loadedItems.length >= DefaultPageSizeProcessConfig,
        query,
        orderBy,
        orderDirection,
      })),
    [listAsync, searchFields, withDeleted]
  );
};
