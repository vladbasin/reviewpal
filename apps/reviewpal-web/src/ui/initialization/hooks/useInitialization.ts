import type { LoadableStateType } from '@reviewpal/web/state';
import { createStateSelector, initializeRootAsync, useStateDispatch, useStateSelector } from '@reviewpal/web/state';
import { useEffect, useRef } from 'react';
import { Result } from '@vladbasin/ts-result';

const loadableStateSelector = createStateSelector(
  [({ root }) => root.status, ({ root }) => root.error],
  (status, error) => ({ status, error })
);

export const useInitialization = (): LoadableStateType => {
  const isInitialized = useRef(false);

  const dispatch = useStateDispatch();

  useEffect(() => {
    // We need to run this only once
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    Result.FromPromise(dispatch(initializeRootAsync())).run();
  }, [dispatch]);

  return useStateSelector(loadableStateSelector);
};
