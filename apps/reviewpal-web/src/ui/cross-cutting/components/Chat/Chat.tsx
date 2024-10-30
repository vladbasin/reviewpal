import {
  chatContainerStyle,
  chatInputContainerStyle,
  ChatMessage,
  chatMessagesContainerInnerStyle,
  chatMessagesContainerStyle,
  chatTextInputStyle,
  FillAreaGrid,
  type ChatMessageType,
} from '@reviewpal/web/ui';
import { Box, Divider, Grid2, TextField, Typography } from '@mui/material';
import type { KeyboardEvent } from 'react';
import { useCallback, useState } from 'react';

type ChatPropsType = {
  isLoading: boolean;
  messages: ChatMessageType[];
  onSend: (message: string) => void;
};

export const Chat = ({ isLoading, messages, onSend }: ChatPropsType) => {
  const [userMessage, setUserMessage] = useState('');

  const handleSend = useCallback(() => {
    if (!userMessage || isLoading) {
      return;
    }

    onSend(userMessage);
    setUserMessage('');
  }, [onSend, userMessage, isLoading]);

  const processKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.altKey && !e.shiftKey && !e.ctrlKey) {
        handleSend();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [handleSend]
  );

  return (
    <Grid2 container sx={chatContainerStyle} direction="column" size="grow">
      <Grid2 container sx={chatMessagesContainerStyle} flexGrow={1} wrap="nowrap" direction="column-reverse">
        {!isLoading && messages.length === 0 && (
          <FillAreaGrid center size="grow">
            <Typography color="secondary">No messages yet</Typography>
          </FillAreaGrid>
        )}
        <Box sx={chatMessagesContainerInnerStyle}>
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
          {/* Role attribute is ChatMessage prop, not aria-role */}
          {/* eslint-disable-next-line jsx-a11y/aria-role */}
          {isLoading && <ChatMessage role="assistant" />}
        </Box>
      </Grid2>
      <Grid2 size="auto">
        <Divider variant="fullWidth" />
      </Grid2>
      <Grid2 size="auto" container direction="row" alignItems="center" spacing={1} sx={chatInputContainerStyle}>
        <Grid2 size="grow">
          <TextField
            autoFocus
            multiline
            variant="outlined"
            placeholder="Your message..."
            fullWidth
            sx={chatTextInputStyle}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={processKeyDown}
          />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
