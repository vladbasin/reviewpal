import { Grid2, Stack, Typography } from '@mui/material';
import { titledPageContainerStyle, titledPageContainerSubtitleStyle, useTitle } from '@reviewpal/web/ui';
import type { PropsWithChildren, ReactNode } from 'react';
import { isNil } from 'lodash';

type TitledPageContainerPropsType = PropsWithChildren<{
  title: string;
  subtitle?: string;
  adornment?: ReactNode;
}>;

export const TitledPageContainer = ({ children, title, subtitle, adornment }: TitledPageContainerPropsType) => {
  useTitle(title);

  return (
    <Grid2 container direction="column" spacing={3} sx={titledPageContainerStyle} size={12}>
      <Grid2>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="column" spacing={1}>
            <Typography variant="h5">{title}</Typography>
            {!isNil(subtitle) && (
              <Typography variant="subtitle1" sx={titledPageContainerSubtitleStyle}>
                {subtitle}
              </Typography>
            )}
          </Stack>
          {adornment}
        </Stack>
      </Grid2>
      {children}
    </Grid2>
  );
};
