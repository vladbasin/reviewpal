import { useCallback } from 'react';
import type { AppRoutesType, RouteParamsType } from '@reviewpal/web/ui';
import { buildUrl } from '@reviewpal/web/ui';

export const useTypedLink = () => {
  return useCallback(
    <T extends AppRoutesType>(routeName: T, params: RouteParamsType<T>) => buildUrl(routeName, params),
    []
  );
};
