import { formatRouteWithParams } from '@reviewpal/web/cross-cutting';
import type { AppRoutesType, RouteParamsType } from '@reviewpal/web/ui';
import { AppRoutes } from '@reviewpal/web/ui';

export const buildUrl = <T extends AppRoutesType>(
  route: T,
  params: RouteParamsType<T>,
  includeHost?: boolean
): string => {
  const path = formatRouteWithParams(AppRoutes[route], params);
  return includeHost ? new URL(path, window.location.origin).toString() : path;
};
