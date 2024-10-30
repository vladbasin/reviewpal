import type { InteractivePrReviewerAnalyticsSummaryType } from '@reviewpal/common/reviewers';
import { processError } from '@reviewpal/web/cross-cutting';
import { useInteractivePrAnalyticsAdminApi } from '@reviewpal/web/ui';
import { useEffect, useMemo, useState } from 'react';

export const useInteractivePrAnalyticsSummary = () => {
  const api = useInteractivePrAnalyticsAdminApi();

  const [summary, setSummary] = useState<InteractivePrReviewerAnalyticsSummaryType>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setIsLoading(true);
    api
      .provideSummaryAsync()
      .onSuccess((summary) => setSummary(summary))
      .onFailureWithError((error) => setError(processError(error).message))
      .onBoth(() => setIsLoading(false))
      .run();
  }, [api]);

  return useMemo(() => ({ summary, isLoading, error }), [summary, isLoading, error]);
};
