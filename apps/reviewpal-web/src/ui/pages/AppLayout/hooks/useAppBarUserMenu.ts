import { Analytics, Flaky, Group, Home, Hub, Logout } from '@mui/icons-material';
import { useCurrentUser, useLogout } from '@reviewpal/web/ui/auth';
import type { AppBarUserMenuType } from '@reviewpal/web/ui/cross-cutting';
import { useTypedNavigate } from '@reviewpal/web/ui/navigation';
import { useMemo } from 'react';

export const useAppBarUserMenu = (): AppBarUserMenuType => {
  const currentUser = useCurrentUser();
  const logout = useLogout();
  const navigate = useTypedNavigate();

  return useMemo((): AppBarUserMenuType => {
    const items: AppBarUserMenuType['items'] = [];

    if (!currentUser) {
      return { items };
    }

    if (currentUser.role === 'admin') {
      items.push(
        {
          type: 'button',
          label: 'Administration',
          disabled: true,
        },
        {
          type: 'button',
          label: 'Users',
          disabled: false,
          Icon: Group,
          onClick: () => navigate('users', {}),
        },
        {
          type: 'button',
          label: 'Integrations',
          disabled: false,
          Icon: Hub,
          onClick: () => navigate('integrations', {}),
        },
        {
          type: 'button',
          label: 'Reviewers',
          disabled: false,
          Icon: Flaky,
          onClick: () => navigate('reviewers', {}),
        },
        {
          type: 'button',
          label: 'Analytics',
          disabled: false,
          Icon: Analytics,
          onClick: () => navigate('interactivePrAnalytics', {}),
        },
        { type: 'divider' }
      );
    }

    items.push(
      {
        type: 'button',
        label: 'Home',
        disabled: false,
        Icon: Home,
        onClick: () => navigate('home', {}),
      },
      {
        type: 'button',
        label: 'Logout',
        disabled: false,
        Icon: Logout,
        onClick: logout,
      }
    );

    return { items };
  }, [currentUser, logout, navigate]);
};
