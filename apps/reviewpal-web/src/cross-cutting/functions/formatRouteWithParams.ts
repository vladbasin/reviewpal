export const formatRouteWithParams = (route: string, params: Record<string, string>): string => {
  let result = route;

  for (const key of Object.keys(params)) {
    result = result.replace(`:${key}?`, params[key]).replace(`:${key}`, params[key]);
  }

  // remove params that were not replaced
  result = result.replace(/\/:[^/?]*(\?)?/g, '');

  return result;
};
