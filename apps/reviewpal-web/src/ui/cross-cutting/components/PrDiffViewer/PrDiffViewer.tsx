import type { MoveDirectionType, PrCommentType, PrFileWithDiffType } from '@reviewpal/web/cross-cutting';
import './styles.css';
import { PrDiffFileViewer } from '@reviewpal/web/ui';
import { useMemo } from 'react';
import type { ChangeData } from 'react-diff-view';

type PrDiffViewerPropsType = {
  files: PrFileWithDiffType[];
  getFileComments: (filename: string) => PrCommentType[];
  onAddComment?: (filename: string, change: ChangeData, changeIndex: number, hunkIndex: number) => void;
  onDeleteComment?: (id: string) => void;
  onUpdateComment?: (id: string, content: string) => void;
  onMoveComment?: (id: string, direction: MoveDirectionType) => void;
  onDiscussComment?: (id: string) => void;
  onSubmitComment?: (id: string) => void;
};

export const PrDiffViewer = ({
  files,
  getFileComments,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  onMoveComment,
  onDiscussComment,
  onSubmitComment,
}: PrDiffViewerPropsType) => {
  return useMemo(
    () =>
      files.map((file) => (
        <PrDiffFileViewer
          key={file.pr.sha}
          file={file}
          comments={getFileComments(file.pr.filename)}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onUpdateComment={onUpdateComment}
          onMoveComment={onMoveComment}
          onDiscussComment={onDiscussComment}
          onSubmitComment={onSubmitComment}
        />
      )),
    [
      files,
      getFileComments,
      onAddComment,
      onDeleteComment,
      onUpdateComment,
      onMoveComment,
      onDiscussComment,
      onSubmitComment,
    ]
  );
};
