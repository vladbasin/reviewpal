import { useInitialization } from '@reviewpal/web/ui';
import { LoadingState } from '@reviewpal/web/ui/cross-cutting';
import type { PropsWithChildren } from 'react';

type InitializerPropsType = PropsWithChildren<object>;

export const Initializer = ({ children }: InitializerPropsType) => {
  const { status, error } = useInitialization();

  return status === 'success' ? children : <LoadingState status={status} error={error} />;
};
