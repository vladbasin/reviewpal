import { useParams } from 'react-router-dom';
import type { AppRoutesType, RouteParamsType } from '@reviewpal/web/ui';

export const useTypedParams = <T extends AppRoutesType>(_: T): RouteParamsType<T> => {
  const params = useParams();

  return params as RouteParamsType<T>;
};
