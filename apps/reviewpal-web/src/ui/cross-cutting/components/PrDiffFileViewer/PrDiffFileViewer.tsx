import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import { memo, useCallback, useMemo } from 'react';
import type { ChangeData, GutterOptions, HunkData } from 'react-diff-view';
import { Diff, Hunk, tokenize } from 'react-diff-view';
import { findChangeLocation, PrDiffCommentEditor, PrDiffGutter } from '@reviewpal/web/ui';
import type { MoveDirectionType, PrCommentType, PrFileWithDiffType } from '@reviewpal/web/cross-cutting';
import { ExpandMore } from '@mui/icons-material';
import refactor from 'refractor';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import { getCodeLanguageFromFilename } from '@reviewpal/common/cross-cutting';

type PrDiffFileViewerPropsType = {
  file: PrFileWithDiffType;
  comments: PrCommentType[];
  onAddComment?: (filename: string, change: ChangeData, changeIndex: number, hunkIndex: number) => void;
  onDeleteComment?: (id: string) => void;
  onUpdateComment?: (id: string, content: string) => void;
  onMoveComment?: (id: string, direction: MoveDirectionType) => void;
  onDiscussComment?: (id: string) => void;
  onSubmitComment?: (id: string) => void;
};

export const PrDiffFileViewer = memo(
  ({
    file,
    comments,
    onAddComment,
    onDeleteComment,
    onUpdateComment,
    onMoveComment,
    onDiscussComment,
    onSubmitComment,
  }: PrDiffFileViewerPropsType) => {
    const handleAddComment = useCallback(
      (change: ChangeData) => {
        const changeLocation = findChangeLocation(file.diff, change);
        if (changeLocation) {
          onAddComment?.(file.pr.filename, change, changeLocation.changeIndex, changeLocation.hunkIndex);
        }
      },
      [onAddComment, file.diff, file.pr.filename]
    );

    const renderGutter = useCallback(
      (options: GutterOptions) => <PrDiffGutter {...options} onAddComment={handleAddComment} />,
      [handleAddComment]
    );
    const renderHunks = useCallback(
      (hunks: HunkData[]) => hunks.flatMap((hunk) => <Hunk key={hunk.content} hunk={hunk} />),
      []
    );
    const widgets = useMemo((): Record<string, ReactNode[]> => {
      const result = comments.reduce<Record<string, ReactNode[]>>((result, comment) => {
        result[comment.changeKey] = [
          ...(result[comment.changeKey] ?? []),
          <PrDiffCommentEditor
            key={comment.id}
            comment={comment}
            onDelete={onDeleteComment}
            onUpdate={onUpdateComment}
            onMove={onMoveComment}
            onDiscuss={onDiscussComment}
            onSubmit={onSubmitComment}
          />,
        ];
        return result;
      }, {});

      return Object.entries(result).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: (
            <Stack direction="column" spacing={2}>
              {value}
            </Stack>
          ),
        }),
        {}
      );
    }, [comments, onDeleteComment, onUpdateComment, onMoveComment, onDiscussComment, onSubmitComment]);

    const tokens = useMemo(
      () =>
        tokenize(file.diff.hunks, {
          highlight: true,
          refractor: refactor,
          language: getCodeLanguageFromFilename(file.pr.filename),
        }),
      [file.diff.hunks, file.pr.filename]
    );

    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>{file.diff.newPath}</AccordionSummary>
        <AccordionDetails>
          <Diff
            viewType="unified"
            diffType={file.diff.type}
            hunks={file.diff.hunks}
            tokens={tokens}
            widgets={widgets}
            renderGutter={renderGutter}
          >
            {renderHunks}
          </Diff>
        </AccordionDetails>
      </Accordion>
    );
  }
);
