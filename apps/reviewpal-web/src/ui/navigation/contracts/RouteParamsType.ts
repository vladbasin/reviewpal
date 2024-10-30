// If follow eslint suggestion here, Start will be marked as error
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AppRoutes, AppRoutesType } from '@reviewpal/web/ui';

type ExtractRouteParamsType<T> = string extends T
  ? Record<string, string>
  : T extends `${infer Start}:${infer Param}?/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParamsType<Rest>]?: string }
  : T extends `${infer Start}:${infer Param}?`
  ? { [k in Param]?: string }
  : T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParamsType<Rest>]: string }
  : T extends `${infer Start}:${infer Param}`
  ? { [k in Param]: string }
  : // If follow eslint suggestions here, it will break the case of this url: /start/:param/end
    // eslint-disable-next-line @typescript-eslint/ban-types
    {};

export type RouteParamsType<TRouteName extends AppRoutesType> = ExtractRouteParamsType<(typeof AppRoutes)[TRouteName]>;
