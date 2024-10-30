import type { ReviewerConfigApiType } from '@reviewpal/common/reviewerConfigs';
import { useReviewerConfigsApi } from '@reviewpal/web/ui';
import { AsyncDataGrid, useItemListDataLoader } from '@reviewpal/web/ui/cross-cutting';

type ReviewerConfigsDataGridPropsType = {
  onItemClick?: (item: ReviewerConfigApiType) => void;
};

export const ReviewerConfigsDataGrid = ({ onItemClick }: ReviewerConfigsDataGridPropsType) => {
  const reviewerConfigsApi = useReviewerConfigsApi();

  const dataLoader = useItemListDataLoader<ReviewerConfigApiType>({
    listAsync: reviewerConfigsApi.listAsync.bind(reviewerConfigsApi),
    searchFields: ['name'],
  });

  return (
    <AsyncDataGrid dataLoader={dataLoader} titleGetter={'name'} subtitleGetter={'reviewer'} onItemClick={onItemClick} />
  );
};
