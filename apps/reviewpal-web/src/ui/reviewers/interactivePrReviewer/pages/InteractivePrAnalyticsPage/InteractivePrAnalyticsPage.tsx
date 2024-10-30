import { Grid2 } from '@mui/material';
import {
  InteractivePrAnalyticsAdminDataTable,
  InteractivePrAnalyticsSummary,
  TitledPageContainer,
  useTitle,
} from '@reviewpal/web/ui';

export const InteractivePrAnalyticsPage = () => {
  useTitle('Analytics');

  return (
    <TitledPageContainer title="Analytics">
      <Grid2 container>
        <InteractivePrAnalyticsSummary />
      </Grid2>
      <Grid2>
        <InteractivePrAnalyticsAdminDataTable />
      </Grid2>
    </TitledPageContainer>
  );
};
