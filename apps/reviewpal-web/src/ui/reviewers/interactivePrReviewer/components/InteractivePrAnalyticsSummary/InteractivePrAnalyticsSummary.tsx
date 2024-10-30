import { Alert, Grid2, Skeleton } from '@mui/material';
import { AnalyticsCard, useInteractivePrAnalyticsSummary } from '@reviewpal/web/ui';
import { useMemo } from 'react';

export const InteractivePrAnalyticsSummary = () => {
  const { summary, error, isLoading } = useInteractivePrAnalyticsSummary();

  const summaryKeyValues = useMemo(
    () =>
      summary
        ? [
            { title: 'Reviews', value: summary.reviews },
            { title: 'AI suggestions', value: summary.codeSuggestions },
            { title: 'Published comments', value: summary.publishedComments },
            { title: 'Discussions', value: summary.discussions },
            { title: 'Input tokens', value: summary.inputTokens },
            { title: 'Output tokens', value: summary.outputTokens },
          ]
        : [],
    [summary]
  );

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && isLoading && <Skeleton />}
      {!error && !isLoading && summary && (
        <Grid2 container spacing={2}>
          {summaryKeyValues.map(({ title, value }) => (
            <Grid2 key={title}>
              <AnalyticsCard title={title} value={value} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </>
  );
};
