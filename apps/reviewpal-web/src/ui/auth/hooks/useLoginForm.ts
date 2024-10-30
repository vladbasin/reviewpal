import type { AuthorizeWithPasswordArgsType } from '@reviewpal/common/auth';
import { AuthorizeWithPasswordArgsTypeSchema } from '@reviewpal/common/auth';
import { authorizeWithPasswordAsync, convertUnwrappedToResult, useStateDispatch } from '@reviewpal/web/state';
import { createOnSubmitHandler, useFullScreenLoaderPresenter } from '@reviewpal/web/ui';
import { useFormik } from 'formik';
import type { RefObject } from 'react';
import { useMemo } from 'react';

export const useLoginForm = (formRef: RefObject<HTMLElement>) => {
  const fullScreenLoaderPresenter = useFullScreenLoaderPresenter();

  const dispatch = useStateDispatch();

  const formik = useFormik<AuthorizeWithPasswordArgsType>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: AuthorizeWithPasswordArgsTypeSchema,
    onSubmit: createOnSubmitHandler(
      (values) => convertUnwrappedToResult(dispatch(authorizeWithPasswordAsync(values)).unwrap()).void,
      fullScreenLoaderPresenter,
      formRef
    ),
  });

  return useMemo(() => ({ formik }), [formik]);
};
