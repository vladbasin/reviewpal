import type { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import type { DependencyList } from 'react';
import { useEffect } from 'react';
import { useEventAggregator } from '@reviewpal/web/ui';

export type AsyncHandlerType<T> = ((arg: Maybe<T>) => Result<void>) | (() => Result<void>);

export const useEventEffectAsync = <T>(handler: AsyncHandlerType<T>, eventName: string, deps: DependencyList): void => {
  const eventAggregator = useEventAggregator();

  useEffect(() => {
    const onEventFired = (arg: T) => {
      return handler(arg);
    };

    const id = eventAggregator.subscribe<T>(eventName, (arg) => onEventFired(arg));

    return () => {
      eventAggregator.unsubscribe(id);
    };
    // Disabling, because eslint cannot statically check the dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, eventName, eventAggregator, ...deps]);
};
