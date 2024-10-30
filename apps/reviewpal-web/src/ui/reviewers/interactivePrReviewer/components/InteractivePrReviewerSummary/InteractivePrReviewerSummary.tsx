import { Link, Typography } from '@mui/material';
import { useInteractivePrUrl } from '@reviewpal/web/ui';

export const InteractivePrReviewerSummary = () => {
  const url = useInteractivePrUrl();

  return (
    <Typography>
      Finalize and&nbsp;
      <Link href={url} target="_blank">
        submit review on GitHub
      </Link>
    </Typography>
  );
};
