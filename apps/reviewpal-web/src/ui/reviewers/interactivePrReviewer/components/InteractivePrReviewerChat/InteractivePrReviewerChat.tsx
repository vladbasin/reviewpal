import { RestartAlt } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import {
  interactivePrReviewerChatDialogContentStyle,
  interactivePrReviewerChatDialogPaperStyle,
  useInteractivePrChat,
} from '@reviewpal/web/ui';
import { Chat } from '@reviewpal/web/ui/cross-cutting';

type InteractivePrReviewerChatPropsType = {
  commentId?: string;
  isChatOpen: boolean;
  onClose: () => void;
  onStartOver: () => void;
};

export const InteractivePrReviewerChat = ({
  commentId,
  isChatOpen,
  onClose,
  onStartOver,
}: InteractivePrReviewerChatPropsType) => {
  const { messages, isLoading, onSend } = useInteractivePrChat({
    commentId: commentId ?? '',
  });

  return (
    <Dialog open={isChatOpen} maxWidth="lg" fullWidth PaperProps={{ sx: interactivePrReviewerChatDialogPaperStyle }}>
      <DialogContent sx={interactivePrReviewerChatDialogContentStyle}>
        <Chat messages={messages} isLoading={isLoading} onSend={onSend} />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onStartOver} startIcon={<RestartAlt />}>
          Start over
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
