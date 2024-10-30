import { Flaky } from '@mui/icons-material';
import { Avatar, Box, Grid2, Stack, Typography } from '@mui/material';
import {
  chatMessageAssistantAvatarStyle,
  chatMessageSkeletonStyle,
  getChatMessageContainerStyle,
  getChatMessageContentContainerStyle,
} from '@reviewpal/web/ui';
import { isNil } from 'lodash';

type ChatMessagePropsType = {
  role: 'user' | 'assistant';
  content?: string;
};

export const ChatMessage = ({ role, content }: ChatMessagePropsType) => {
  return (
    <Grid2 container direction="row" wrap="nowrap" sx={getChatMessageContainerStyle(role === 'user')}>
      <Grid2 container>
        <Stack flexWrap="nowrap" direction="row" spacing={1}>
          {role === 'assistant' && (
            <Avatar sx={chatMessageAssistantAvatarStyle}>
              <Flaky fontSize="small" color="warning" />
            </Avatar>
          )}
          <Box sx={getChatMessageContentContainerStyle(role === 'user')}>
            {isNil(content) ? (
              <Typography color="text.secondary" sx={chatMessageSkeletonStyle}>
                Thinking...
              </Typography>
            ) : (
              <Typography whiteSpace="pre-wrap">{content}</Typography>
            )}
          </Box>
        </Stack>
      </Grid2>
    </Grid2>
  );
};
