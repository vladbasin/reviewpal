import { Card, CardContent, Typography } from '@mui/material';
import { asyncDataGridItemCardStyle, asyncDataGridItemCardSubtitleStyle } from '@reviewpal/web/ui';

type AsyncDataGridItemPropsType = {
  title: string;
  subtitle: string;
  onClick?: () => void;
};

export const AsyncDataGridItem = ({ title, subtitle, onClick }: AsyncDataGridItemPropsType) => {
  return (
    <Card sx={asyncDataGridItemCardStyle} onClick={onClick}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography sx={asyncDataGridItemCardSubtitleStyle}>{subtitle}</Typography>
      </CardContent>
    </Card>
  );
};
