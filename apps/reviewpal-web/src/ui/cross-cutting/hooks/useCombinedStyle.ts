import { useTheme, type Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import type { Maybe } from '@vladbasin/ts-types';
import { useMemo } from 'react';

export const useCombinedStyle = (...styles: Maybe<SxProps<Theme>>[]): Maybe<SxProps<Theme>> => {
  const theme = useTheme();

  return useMemo(() => {
    const combined = styles.reduce(
      (agg, style) => ({ ...agg, ...(typeof style === 'function' ? style?.(theme) : style) }),
      {}
    );

    return combined;
    // For some reason it requires always to include styles as is into dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...styles, theme]);
};
