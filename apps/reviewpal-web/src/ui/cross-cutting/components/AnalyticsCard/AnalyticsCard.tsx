import { Card, CardContent, Typography } from '@mui/material';
import { analyticsCardTitleStyle } from '@reviewpal/web/ui';

export const AnalyticsCard = ({ title, value }: { title: string; value: string | number }) => {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom sx={analyticsCardTitleStyle}>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
