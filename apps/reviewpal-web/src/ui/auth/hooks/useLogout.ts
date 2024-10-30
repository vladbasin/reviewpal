import { convertUnwrappedToResult, logoutAsync, useStateDispatch } from '@reviewpal/web/state';
import { useCallback } from 'react';
import { useExecuteWithLoader } from '@reviewpal/web/ui';

export const useLogout = () => {
  const dispatch = useStateDispatch();
  const executeWithLoader = useExecuteWithLoader();

  return useCallback(
    () =>
      executeWithLoader({
        executor: () => convertUnwrappedToResult(dispatch(logoutAsync()).unwrap()).void,
        errorBehavior: 'showSnackbar',
      }),
    [executeWithLoader, dispatch]
  );
};
