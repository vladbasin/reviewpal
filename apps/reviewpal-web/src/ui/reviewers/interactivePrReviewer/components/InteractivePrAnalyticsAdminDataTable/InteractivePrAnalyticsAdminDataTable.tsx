import type { InteractivePrUserAnalyticsAdminApiType } from '@reviewpal/common/reviewers';
import type { AsyncDataTableColumnType } from '@reviewpal/web/ui';
import { AsyncDataTable, useInteractivePrAnalyticsAdminApi, useItemListDataLoader } from '@reviewpal/web/ui';
import { useMemo } from 'react';

export const InteractivePrAnalyticsAdminDataTable = () => {
  const interactivePrAnalyticsAdminApi = useInteractivePrAnalyticsAdminApi();

  const columns = useMemo(
    (): AsyncDataTableColumnType<InteractivePrUserAnalyticsAdminApiType>[] => [
      {
        title: 'Name',
        valueGetter: ({ user }) => user.name,
        orderableBy: 'user.name',
        isDefaultOrder: true,
      },
      {
        title: 'Reviews',
        valueGetter: ({ reviews }) => reviews,
        orderableBy: 'reviews',
      },
      {
        title: 'AI suggestions',
        valueGetter: ({ codeSuggestions }) => codeSuggestions,
        orderableBy: 'codeSuggestions',
      },
      {
        title: 'Published comments',
        valueGetter: ({ publishedComments }) => publishedComments,
        orderableBy: 'publishedComments',
      },
      {
        title: 'Discussions',
        valueGetter: ({ discussions }) => discussions,
        orderableBy: 'discussions',
      },
      {
        title: 'Input tokens',
        valueGetter: ({ inputTokens }) => inputTokens,
        orderableBy: 'inputTokens',
      },
      {
        title: 'Output tokens',
        valueGetter: ({ outputTokens }) => outputTokens,
        orderableBy: 'outputTokens',
      },
    ],
    []
  );

  const dataLoader = useItemListDataLoader<InteractivePrUserAnalyticsAdminApiType>({
    listAsync: interactivePrAnalyticsAdminApi.listAsync.bind(interactivePrAnalyticsAdminApi),
    searchFields: ['user.name'],
    withDeleted: true,
  });

  return <AsyncDataTable columns={columns} dataLoader={dataLoader} />;
};
