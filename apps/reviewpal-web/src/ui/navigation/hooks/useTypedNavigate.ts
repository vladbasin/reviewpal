import { useCallback } from 'react';
import type { NavigateOptions } from 'react-router-dom';
import { createSearchParams, useNavigate } from 'react-router-dom';
import type { Maybe } from '@vladbasin/ts-types';
import type { AppRoutesType, RouteParamsType } from '@reviewpal/web/ui';
import { buildUrl } from '@reviewpal/web/ui';

export const useTypedNavigate = () => {
  const navigate = useNavigate();

  return useCallback(
    <T extends AppRoutesType>(
      routeName: T,
      params: RouteParamsType<T>,
      queryString?: Record<string, Maybe<string | string[]>>,
      options?: NavigateOptions
    ) => {
      navigate(
        {
          pathname: buildUrl(routeName, params),
          search:
            queryString &&
            createSearchParams(
              Object.entries(queryString).reduce(
                (result, [key, value]) => (value ? { ...result, [key]: value } : result),
                {}
              )
            ).toString(),
        },
        options
      );
    },
    [navigate]
  );
};
