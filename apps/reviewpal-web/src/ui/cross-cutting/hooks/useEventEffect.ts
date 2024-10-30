import { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import type { DependencyList } from 'react';
import { useCallback } from 'react';
import { useEventEffectAsync } from '@reviewpal/web/ui';

export const useEventEffect = <T>(handler: (arg: Maybe<T>) => void, eventName: string, deps: DependencyList): void => {
  const handlerAsync = useCallback(
    (arg: Maybe<T>) => {
      handler(arg);

      return Result.Void();
    },
    [handler]
  );

  return useEventEffectAsync(handlerAsync, eventName, deps);
};
