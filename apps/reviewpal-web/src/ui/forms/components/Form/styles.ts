import type { SxProps } from '@mui/material';
import { MiddleScreenFormWidth } from '@reviewpal/web/ui/cross-cutting';

export const formBaseStyle: SxProps = {
  pt: 1,
};

export const formMiddleScreenStyle: SxProps = {
  width: MiddleScreenFormWidth,
  maxWidth: '100%',
};

export const formAlertStyle: SxProps = {
  width: '100%',
};
