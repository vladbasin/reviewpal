import { Grid2 } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { centerPageContainerStyle, FillAreaGrid } from '@reviewpal/web/ui';

type CenterPageContainerPropsType = PropsWithChildren<object>;

export const CenterPageContainer = ({ children }: CenterPageContainerPropsType) => {
  return (
    <FillAreaGrid center fullHeight direction="column">
      <Grid2 container sx={centerPageContainerStyle} size={{ xs: 'grow' }}>
        <Grid2>{children}</Grid2>
      </Grid2>
    </FillAreaGrid>
  );
};
