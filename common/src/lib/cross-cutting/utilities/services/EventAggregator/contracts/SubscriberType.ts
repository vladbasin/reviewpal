import type { SubscriberActionType } from './SubscriberActionType';

export type SubscriberType<T> = {
  id: string;
  action: SubscriberActionType<T>;
};
