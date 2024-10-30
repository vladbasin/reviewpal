import type { ResetPasswordArgsType } from '@reviewpal/common/auth';
import { ResetPasswordArgsTypeSchema } from '@reviewpal/common/auth';
import {
  createOnSubmitHandler,
  useAuthApi,
  useFullScreenLoaderPresenter,
  useSnackbarPresenter,
  useTypedNavigate,
} from '@reviewpal/web/ui';
import { useFormik } from 'formik';
import type { RefObject } from 'react';
import { useCallback, useMemo } from 'react';

type ResetPasswordFormOptionsType = {
  token: string;
  formRef: RefObject<HTMLElement>;
};

export const useResetPasswordForm = ({ token, formRef }: ResetPasswordFormOptionsType) => {
  const fullScreenLoaderPresenter = useFullScreenLoaderPresenter();

  const authApi = useAuthApi();

  const navigate = useTypedNavigate();
  const snackbarPresenter = useSnackbarPresenter();
  const handleSuccess = useCallback(() => {
    snackbarPresenter.present({ message: 'New password was saved', severity: 'success' });
    navigate('login', {});
  }, [navigate, snackbarPresenter]);

  const formik = useFormik<ResetPasswordArgsType>({
    initialValues: {
      token,
      password: '',
      passwordRepeat: '',
    },
    validationSchema: ResetPasswordArgsTypeSchema,
    onSubmit: createOnSubmitHandler(
      (values) => authApi.resetPasswordAsync(values).onSuccess(() => handleSuccess()),
      fullScreenLoaderPresenter,
      formRef
    ),
  });

  return useMemo(() => ({ formik }), [formik]);
};
