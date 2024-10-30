import type { ReviewerConfigAdminApiType } from '@reviewpal/common/reviewerConfigs';
import type { AsyncDataTableColumnType, AsyncDataTableFooterOptionsType } from '@reviewpal/web/ui';
import { AsyncDataTable, useItemListDataLoader, useReviewerConfigsAdminApi } from '@reviewpal/web/ui';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

type ReviewerConfigsAdminDataTablePropsType = {
  onItemClick?: (item: ReviewerConfigAdminApiType) => void;
  footer?: (options: AsyncDataTableFooterOptionsType<ReviewerConfigAdminApiType>) => ReactNode;
};

export const ReviewerConfigsAdminDataTable = ({ onItemClick, footer }: ReviewerConfigsAdminDataTablePropsType) => {
  const reviewerConfigsAdminApi = useReviewerConfigsAdminApi();

  const columns = useMemo(
    (): AsyncDataTableColumnType<ReviewerConfigAdminApiType>[] => [
      {
        title: 'Name',
        valueGetter: 'name',
        orderableBy: 'name',
        isDefaultOrder: true,
      },
      {
        title: 'Reviewer',
        valueGetter: 'reviewer',
      },
    ],
    []
  );

  const dataLoader = useItemListDataLoader<ReviewerConfigAdminApiType>({
    listAsync: reviewerConfigsAdminApi.listAsync.bind(reviewerConfigsAdminApi),
    searchFields: ['name'],
  });

  return <AsyncDataTable columns={columns} dataLoader={dataLoader} onItemClick={onItemClick} footer={footer} />;
};
