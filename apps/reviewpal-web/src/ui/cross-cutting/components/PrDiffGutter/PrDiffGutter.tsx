import type { ChangeData, GutterOptions } from 'react-diff-view';
import { useCallback, useMemo } from 'react';
import { IconButton } from '@mui/material';
import { prDiffGutterStyle } from '@reviewpal/web/ui';
import { AddCircle } from '@mui/icons-material';

type PrDiffGutterPropsType = GutterOptions & {
  onAddComment?: (change: ChangeData) => void;
};

export const PrDiffGutter = ({
  onAddComment,
  wrapInAnchor,
  renderDefault,
  inHoverState,
  side,
  change,
}: PrDiffGutterPropsType) => {
  const shouldShowAddComment = useMemo(() => inHoverState && side === 'new', [inHoverState, side]);

  const handleCommentAdded = useCallback(() => onAddComment?.(change), [onAddComment, change]);
  const defaultValue = useMemo(() => wrapInAnchor(renderDefault()), [wrapInAnchor, renderDefault]);

  return shouldShowAddComment ? (
    <IconButton sx={prDiffGutterStyle} onClick={handleCommentAdded}>
      <AddCircle sx={prDiffGutterStyle} />
    </IconButton>
  ) : (
    defaultValue
  );
};
