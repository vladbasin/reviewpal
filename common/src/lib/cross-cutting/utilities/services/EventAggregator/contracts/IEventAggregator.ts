import type { Result } from '@vladbasin/ts-result';
import type { SubscriberActionType } from './SubscriberActionType';

export interface IEventAggregator {
  emit<T>(event: string, arg?: T): void;
  emitAwaitingSubscribersAsync<T>(event: string, arg?: T): Result<void>;
  emitAsync<T>(event: string, awaitSubscribers: boolean, arg?: T): Result<void>;
  subscribe<T = unknown>(event: string, action: SubscriberActionType<T>): string;
  subscribeOnceAwaitingAsync(event: string, timeout: number): Result<unknown>;
  unsubscribe(subscriberId: string): void;
}
