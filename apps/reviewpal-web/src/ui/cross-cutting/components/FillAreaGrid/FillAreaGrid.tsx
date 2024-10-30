import type { Grid2Props } from '@mui/material';
import { Grid2 } from '@mui/material';
import { useMemo } from 'react';
import { fillAreaGridContainerStyle, useCombinedStyle } from '@reviewpal/web/ui';
import { fillAreaGridFullHeightContainerStyle } from './styles';

export type FillAreaGridProps = Grid2Props & {
  center?: boolean;
  fullHeight?: boolean;
};

export const FillAreaGrid = ({ center, sx, fullHeight, ...restProps }: FillAreaGridProps) => {
  const centerProps = useMemo(
    () =>
      center && {
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      },
    [center]
  );

  const heightProps = useMemo(
    () => (fullHeight === true ? fillAreaGridFullHeightContainerStyle : undefined),
    [fullHeight]
  );

  const style = useCombinedStyle(fillAreaGridContainerStyle, sx, heightProps);

  return <Grid2 container {...restProps} {...centerProps} sx={style} />;
};
