import type { SxProps } from '@mui/material';
import { AsyncDataGridItemCardMinWidth } from '@reviewpal/web/ui';

export const asyncDataGridContainerStyle: SxProps = {
  display: 'grid',
  gridGap: 16,
  gridTemplateColumns: `repeat(auto-fit, minmax(${AsyncDataGridItemCardMinWidth}, 1fr))`,
};
