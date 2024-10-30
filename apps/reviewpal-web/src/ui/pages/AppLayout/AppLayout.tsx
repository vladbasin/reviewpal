import { Outlet } from 'react-router-dom';
import { AppBar, FillAreaGrid, useAppBarUserMenu, withAuth } from '@reviewpal/web/ui';

export const AppLayout = withAuth('onlyAuthorized', () => {
  const appBarUserMenu = useAppBarUserMenu();

  return (
    <FillAreaGrid>
      <AppBar userMenu={appBarUserMenu} />
      <Outlet />
    </FillAreaGrid>
  );
});
