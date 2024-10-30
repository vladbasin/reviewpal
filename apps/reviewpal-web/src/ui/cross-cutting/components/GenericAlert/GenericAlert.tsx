import type { AlertProps } from '@mui/material';
import { Alert as MuiAlert } from '@mui/material';
import { useCombinedStyle } from '@reviewpal/web/ui';
import { genericAlertContainerStyle, genericAlertFullWidthStyle } from './styles';

export type GenericAlertPropsType = AlertProps & {
  fullWidth?: boolean;
};

export const GenericAlert = ({ children, sx, fullWidth, ...restProps }: GenericAlertPropsType) => {
  const targetSx = useCombinedStyle(genericAlertContainerStyle, sx, fullWidth ? genericAlertFullWidthStyle : undefined);

  return (
    children && (
      <MuiAlert variant="filled" sx={targetSx} {...restProps}>
        {children}
      </MuiAlert>
    )
  );
};
