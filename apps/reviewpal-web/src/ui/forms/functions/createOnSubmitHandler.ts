import type { Result } from '@vladbasin/ts-result';
import type { FormikHelpers, FormikValues } from 'formik';
import type { IFullScreenLoaderPresenter } from '@reviewpal/web/ui';
import { processError } from '@reviewpal/web/cross-cutting';
import type { RefObject } from 'react';

export const createOnSubmitHandler =
  <T extends FormikValues = FormikValues>(
    handler: (values: T) => Result<void>,
    fullScreenLoader: IFullScreenLoaderPresenter,
    formRef: RefObject<HTMLElement>
  ) =>
  (values: T, { setStatus }: FormikHelpers<T>) => {
    const lid = fullScreenLoader.show();

    return handler(values)
      .withProcessedFailError((error) => processError(error))
      .onFailure(setStatus)
      .onFailure(() => formRef.current?.scrollIntoView(true))
      .recover()
      .onBothExecute(() => fullScreenLoader.hide(lid))
      .asPromise();
  };
