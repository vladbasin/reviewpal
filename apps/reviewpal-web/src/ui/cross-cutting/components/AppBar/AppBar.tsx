import { Flaky, Settings } from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import type { AppBarUserMenuType } from '@reviewpal/web/ui';
import { appBarLogoTitleStyle, AppRoutes, fullWidthStyle } from '@reviewpal/web/ui';
import { useCallback, useMemo, useState } from 'react';

type AppBarPropsType = {
  userMenu: AppBarUserMenuType;
};

export const AppBar = ({ userMenu }: AppBarPropsType) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget), []);
  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  const userMenuElements = useMemo(
    () =>
      userMenu.items.map((item, index) =>
        item.type === 'button' ? (
          <MenuItem
            key={`${item.label}-${index}`}
            onClick={() => {
              handleCloseMenu();
              item.onClick?.();
            }}
            disabled={item.disabled}
          >
            {item.Icon && (
              <ListItemIcon>
                <item.Icon />
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
          </MenuItem>
        ) : (
          <Divider key={`divider-${index}`} />
        )
      ),
    [userMenu.items, handleCloseMenu]
  );

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between" sx={fullWidthStyle}>
          <Typography variant="h6" component="a" href={AppRoutes.home} noWrap sx={appBarLogoTitleStyle}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Flaky fontSize="large" />
              <Box>Review Pal</Box>
            </Stack>
          </Typography>
          <IconButton onClick={handleOpenMenu} size="large">
            <Settings />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
          >
            {userMenuElements}
          </Menu>
        </Stack>
      </Toolbar>
    </MuiAppBar>
  );
};
