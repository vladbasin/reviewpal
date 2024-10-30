import { Alert, CircularProgress, Grid2 } from '@mui/material';
import {
  InteractivePrReviewerWizard,
  TitledPageContainer,
  useReviewerLoader,
  useTypedParams,
  withAuth,
} from '@reviewpal/web/ui';

export const InteractivePrReviewerPage = withAuth('onlyAuthorized', () => {
  const { id } = useTypedParams('interactivePrReviewer');

  const { status, error, reviewerConfig } = useReviewerLoader({ id });

  return (
    <TitledPageContainer title={reviewerConfig?.name ?? 'Reviewer'} subtitle={reviewerConfig?.reviewer}>
      <Grid2>
        {status === 'loading' && <CircularProgress />}
        {status === 'error' && <Alert severity="error">{error}</Alert>}
        {status === 'success' && <InteractivePrReviewerWizard />}
      </Grid2>
    </TitledPageContainer>
  );
});
