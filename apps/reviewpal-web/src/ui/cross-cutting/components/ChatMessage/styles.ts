import type { SxProps } from '@mui/material';

export const chatMessageMessageContainerBaseStyle: SxProps = {
  p: 1,
  mb: 2,
  width: 'fit-content',
  borderRadius: '6px',
};

export const chatMessageUserMessageContainerStyle: SxProps = {
  ...chatMessageMessageContainerBaseStyle,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
};

export const chatMessageAssistantMessageContainerStyle: SxProps = {
  ...chatMessageMessageContainerBaseStyle,
  alignSelf: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
};

export const getChatMessageContainerStyle = (isUser: boolean): SxProps =>
  isUser ? chatMessageUserMessageContainerStyle : chatMessageAssistantMessageContainerStyle;

export const chatMessageAssistantAvatarStyle: SxProps = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  width: '24px',
  height: '24px',
};

export const chatMessageContentContainerBaseStyle: SxProps = {
  ml: 0,
  mr: 0,
  mb: 2,
};

export const chatMessageUserContentContainerStyle: SxProps = {
  ...chatMessageContentContainerBaseStyle,
  justifyContent: 'flex-end',
};

export const chatMessageAssistantContentContainerStyle: SxProps = {
  ...chatMessageContentContainerBaseStyle,
};

export const getChatMessageContentContainerStyle = (isUser: boolean): SxProps =>
  isUser ? chatMessageUserContentContainerStyle : chatMessageAssistantContentContainerStyle;

export const chatMessageSkeletonStyle: SxProps = {
  '@keyframes fade': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
  animation: 'fade 2s infinite',
};
