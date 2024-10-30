import { Result } from '@vladbasin/ts-result';
import { useCallback } from 'react';
import { useFullScreenLoaderPresenter, useSnackbarPresenter } from '@reviewpal/web/ui';
import { processError } from '@reviewpal/web/cross-cutting';

export const useExecuteWithLoader = () => {
  const fullScreenLoader = useFullScreenLoaderPresenter();
  const snackbarPresenter = useSnackbarPresenter();

  return useCallback(
    (args: {
      executor: () => Result<unknown> | Promise<unknown>;
      processError?: (error: string) => void;
      processSuccess?: () => void;
      errorBehavior: 'process' | 'showSnackbar';
      successSnackbarMessage?: string;
    }) => {
      const lid = fullScreenLoader.show();

      const { executor, errorBehavior } = args;

      const executorResult = executor();

      (executorResult instanceof Promise ? Result.FromPromise(executorResult) : executorResult)
        .onSuccessExecute(() => {
          args.processSuccess?.();
          if (args.successSnackbarMessage) {
            snackbarPresenter.present({ message: args.successSnackbarMessage, severity: 'success' });
          }
        })
        .withProcessedFailError((error) => processError(error))
        .onFailure((error) => {
          if (errorBehavior === 'process') {
            args.processError?.(error);
          } else {
            snackbarPresenter.present({ message: error, severity: 'error' });
          }
        })
        .onBothExecute(() => fullScreenLoader.hide(lid))
        .run();
    },
    [fullScreenLoader, snackbarPresenter]
  );
};
