import {
  addPrComment,
  deletePrComment,
  movePrComment,
  startOverDiscussion,
  updatePrComment,
  useStateDispatch,
} from '@reviewpal/web/state';
import {
  InteractivePrReviewerChat,
  useInteractivePrFiles,
  useInteractivePrGetCommentsForFile,
  useInteractivePublishPrComment,
} from '@reviewpal/web/ui';
import { PrDiffViewer } from '@reviewpal/web/ui/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';
import { useCallback, useState } from 'react';
import type { ChangeData } from 'react-diff-view';

export const InteractivePrReviewerBoard = () => {
  const dispatch = useStateDispatch();

  const allFiles = useInteractivePrFiles();
  const getFileComments = useInteractivePrGetCommentsForFile();

  const handleAddComment = useCallback(
    (filename: string, change: ChangeData, changeIndex: number, hunkIndex: number) =>
      dispatch(addPrComment({ filename, change, changeIndex, hunkIndex })),
    [dispatch]
  );
  const handleChangeComment = useCallback(
    (id: string, content: string) => dispatch(updatePrComment({ id, content })),
    [dispatch]
  );
  const handleDeleteComment = useCallback((id: string) => dispatch(deletePrComment(id)), [dispatch]);
  const handleMoveComment = useCallback(
    (id: string, direction: 'up' | 'down') => dispatch(movePrComment({ id, direction })),
    [dispatch]
  );

  const publishComment = useInteractivePublishPrComment();
  const handleSubmitComment = useCallback((id: string) => publishComment(id), [publishComment]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<Maybe<string>>();
  const handleDiscussComment = useCallback((id: string) => {
    setIsChatOpen(true);
    setSelectedCommentId(id);
  }, []);
  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);
  const handleStartOverDiscussion = useCallback(
    () => selectedCommentId && dispatch(startOverDiscussion(selectedCommentId)),
    [dispatch, selectedCommentId]
  );

  return (
    <>
      <PrDiffViewer
        files={allFiles}
        getFileComments={getFileComments}
        onAddComment={handleAddComment}
        onUpdateComment={handleChangeComment}
        onDeleteComment={handleDeleteComment}
        onMoveComment={handleMoveComment}
        onDiscussComment={handleDiscussComment}
        onSubmitComment={handleSubmitComment}
      />
      <InteractivePrReviewerChat
        commentId={selectedCommentId}
        isChatOpen={isChatOpen}
        onClose={handleCloseChat}
        onStartOver={handleStartOverDiscussion}
      />
    </>
  );
};
