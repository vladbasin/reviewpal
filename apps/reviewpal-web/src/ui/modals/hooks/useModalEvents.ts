import type { Result } from '@vladbasin/ts-result';
import { useCallback } from 'react';
import type { ModalPresenterNativeResponseType } from '@reviewpal/web/ui';
import {
  ModalPresenterRequestEventName,
  ModalPresenterResponseEventName,
  useEventAggregator,
  useEventEffect,
  type ModalPresenterNativeRequestType,
} from '@reviewpal/web/ui';

type ShowFunctionType<TOptions, TResult> = (id: string, options?: TOptions) => Result<TResult>;
type HideFunctionType = (id: string) => void;

export const useModalEvents = <TOptions, TResult>(
  Presenter: string,
  hide: HideFunctionType,
  show: ShowFunctionType<TOptions, TResult>
): void => {
  const eventAggregator = useEventAggregator();

  const respond = useCallback(
    (id: string, result: TResult) => {
      const response: ModalPresenterNativeResponseType<TResult> = {
        id,
        Presenter,
        result,
      };
      eventAggregator.emit(ModalPresenterResponseEventName, response);
    },
    [eventAggregator, Presenter]
  );

  useEventEffect<ModalPresenterNativeRequestType<TOptions>>(
    (request) => {
      if (!request || request.Presenter !== Presenter) {
        return;
      }

      switch (request.command) {
        case 'hide':
          hide(request.id);
          break;
        case 'show':
          show(request.id, request.options)
            .onSuccess((result) => {
              respond(request.id, result);
              if (request.autoHide) {
                hide(request.id);
              }
            })
            .run();
          break;
        default:
          throw new Error('Not recognized modal command');
      }
    },
    ModalPresenterRequestEventName,
    [Presenter, respond, hide, show]
  );
};
