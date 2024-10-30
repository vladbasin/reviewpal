import type { SxProps, Theme } from '@mui/system';

export const fullScreenLoaderContentStyle: SxProps<Theme> = {
  padding: (theme) => theme.spacing(2),
} as const;
