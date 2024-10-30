import { ArrowDownward, ArrowUpward, Chat, Delete } from '@mui/icons-material';
import { Alert, Button, Stack, TextField } from '@mui/material';
import type { MoveDirectionType, PrCommentType } from '@reviewpal/web/cross-cutting';
import { prDiffCommentEditorContainerStyle } from '@reviewpal/web/ui';
import type { ChangeEvent } from 'react';
import { memo, useCallback } from 'react';

type PrDiffCommentEditorPropsType = {
  comment: PrCommentType;
  onUpdate?: (id: string, content: string) => void;
  onSubmit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: MoveDirectionType) => void;
  onDiscuss?: (id: string) => void;
};

export const PrDiffCommentEditor = memo(
  ({ comment, onUpdate, onSubmit, onDelete, onMove, onDiscuss }: PrDiffCommentEditorPropsType) => {
    const { content, isPublished, isLineRelated } = comment;

    const handleChanged = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onUpdate?.(comment.id, e.target.value),
      [onUpdate, comment.id]
    );

    const handleSubmit = useCallback(() => onSubmit?.(comment.id), [onSubmit, comment.id]);
    const handleDiscuss = useCallback(() => onDiscuss?.(comment.id), [onDiscuss, comment.id]);
    const handleDelete = useCallback(() => onDelete?.(comment.id), [onDelete, comment.id]);
    const handleMoveDown = useCallback(() => onMove?.(comment.id, 'down'), [onMove, comment.id]);
    const handleMoveUp = useCallback(() => onMove?.(comment.id, 'up'), [onMove, comment.id]);

    return (
      <Stack direction="column" spacing={2} sx={prDiffCommentEditorContainerStyle}>
        <TextField
          value={content}
          onChange={handleChanged}
          type="text"
          multiline
          minRows={3}
          fullWidth
          disabled={isPublished}
        />
        <Stack direction="row" spacing={2}>
          <Button disabled={isPublished} variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            disabled={isPublished}
            variant="contained"
            color="error"
            onClick={handleDelete}
            startIcon={<Delete />}
          >
            Delete
          </Button>
          <Button disabled={isPublished} startIcon={<ArrowUpward />} variant="outlined" onClick={handleMoveUp}>
            Line
          </Button>
          <Button disabled={isPublished} startIcon={<ArrowDownward />} variant="outlined" onClick={handleMoveDown}>
            Line
          </Button>
          {!isLineRelated && <Alert severity="warning">This comment may not be related to this line</Alert>}
          <Button
            disabled={isPublished}
            startIcon={<Chat />}
            variant="outlined"
            color="warning"
            onClick={handleDiscuss}
          >
            Discuss
          </Button>
        </Stack>
        {isPublished && <Alert severity="success">Submitted successfully</Alert>}
      </Stack>
    );
  }
);
