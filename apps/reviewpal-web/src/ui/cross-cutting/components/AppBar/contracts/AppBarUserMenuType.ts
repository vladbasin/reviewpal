import type { SvgIconComponent } from '@mui/icons-material';

export type AppBarUserMenuType = {
  items: (
    | {
        type: 'button';
        label: string;
        disabled: boolean;
        Icon?: SvgIconComponent;
        onClick?: () => void;
      }
    | { type: 'divider' }
  )[];
};
