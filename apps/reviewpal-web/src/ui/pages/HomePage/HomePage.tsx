import { ReviewerConfigsDataGrid, TitledPageContainer, useReviewerOpener, withAuth } from '@reviewpal/web/ui';

export const HomePage = withAuth('onlyAuthorized', () => {
  const openReviewer = useReviewerOpener();

  return (
    <TitledPageContainer title="Home">
      <ReviewerConfigsDataGrid onItemClick={openReviewer} />
    </TitledPageContainer>
  );
});
