import type { Result } from '@vladbasin/ts-result';

export type SubscriberActionType<T> = (arg: T) => Result<void>;
