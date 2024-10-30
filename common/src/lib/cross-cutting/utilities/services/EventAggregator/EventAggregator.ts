import { Result } from '@vladbasin/ts-result';
import { injectable } from 'inversify';
import { v4 } from 'uuid';
import type { IEventAggregator, SubscriberActionType, SubscriberType } from './contracts';

const OnceSubscribedAwaitCheckInterval = 1000;

@injectable()
export class EventAggregator implements IEventAggregator {
  private readonly _eventToSubscribersMap = new Map<string, Map<string, SubscriberType<unknown>>>();
  private readonly _subscriberIdToEventMap = new Map<string, string>();

  public emitAwaitingSubscribersAsync<T>(event: string, arg?: T): Result<void> {
    const subscribers = this._eventToSubscribersMap.get(event);

    if (!subscribers) {
      return Result.Void();
    }

    const tasks = Array.from(subscribers.values()).map((subscriber) => subscriber.action(arg));

    return Result.Combine(tasks).void;
  }

  public emit<T>(event: string, arg?: T): void {
    this.emitAwaitingSubscribersAsync(event, arg).run();
  }

  public emitAsync<T>(event: string, awaitSubscribers: boolean, arg?: T): Result<void> {
    const result = this.emitAwaitingSubscribersAsync(event, arg).runAsResult();

    return awaitSubscribers ? result : Result.Void();
  }

  public subscribeOnceAwaitingAsync(event: string, timeout: number): Result<unknown> {
    const promise = new Promise<unknown>((resolve, reject) => {
      let isRejectedByTimeout = false;
      let isTriggered = false;
      let totalPollingTime = 0;

      const pollingInterval = setInterval(() => {
        if (isTriggered) {
          clearInterval(pollingInterval);
          return;
        }

        totalPollingTime += OnceSubscribedAwaitCheckInterval;

        if (totalPollingTime > timeout) {
          isRejectedByTimeout = true;
          clearInterval(pollingInterval);
          reject(new Error('Timeout exceeded'));
        }
      }, OnceSubscribedAwaitCheckInterval);

      const id = this.subscribe(event, (arg: unknown) => {
        this.unsubscribe(id);

        if (isRejectedByTimeout) {
          return Result.Void();
        }

        resolve(arg);
        isTriggered = true;

        return Result.Void();
      });
    });

    return Result.FromPromise<unknown>(promise);
  }

  public subscribe<T = unknown>(event: string, action: SubscriberActionType<T>): string {
    const id = v4();

    const subscribers = this._eventToSubscribersMap.get(event) ?? new Map();
    subscribers.set(id, { id, action });
    this._subscriberIdToEventMap.set(id, event);

    this._eventToSubscribersMap.set(event, subscribers);

    return id;
  }

  public unsubscribe(subscriberId: string) {
    const event = this._subscriberIdToEventMap.get(subscriberId);

    if (!event) {
      return;
    }

    const subscribers = this._eventToSubscribersMap.get(event);
    subscribers?.delete(subscriberId);
    this._subscriberIdToEventMap.delete(subscriberId);
  }
}
