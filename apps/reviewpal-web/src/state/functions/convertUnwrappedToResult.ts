import { ProcessedError, Result } from '@vladbasin/ts-result';
import { StackCapturedError } from '@reviewpal/common/cross-cutting';

export const convertUnwrappedToResult = <TResult>(unwrappedPromise: Promise<TResult>): Result<TResult> => {
  return Result.FromPromise(unwrappedPromise).onFailureCompensateWithError((error) => {
    // Redux Toolkit's unwrap spoils error type which is important for processing
    if (!(error instanceof ProcessedError) && error.name === 'ProcessedError') {
      return Result.FailWithError(
        new ProcessedError(
          error.message,
          (error as ProcessedError).originalError ||
            new StackCapturedError(
              'Error details are spoiled by Redux unwrap. Wrapping with ErrorWithStack to preserve stack trace.',
              error.stack
            )
        )
      );
    }

    return Result.FailWithError(error);
  });
};
