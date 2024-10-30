import type { SxProps } from '@mui/material';

export const chatContainerStyle: SxProps = {
  height: '100%',
};

export const chatMessagesContainerStyle: SxProps = {
  pt: 2,
  pl: 2,
  pr: 2,
  overflowY: 'auto',
};

export const chatMessagesContainerInnerStyle: SxProps = {
  display: 'flex',
  flexDirection: 'column',
};

export const chatInputContainerStyle: SxProps = {
  p: 1,
};

export const chatTextInputStyle: SxProps = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
};
