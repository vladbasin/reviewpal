import type { UserAdminApiType, UserArgsType } from '@reviewpal/common/users';
import { UserArgsTypeSchema } from '@reviewpal/common/users';
import type { UseCrudFormExternalOptionsType } from '@reviewpal/web/ui';
import {
  buildUrl,
  useCrudForm,
  useFullScreenLoaderPresenter,
  useSnackbarPresenter,
  useUsersAdminApi,
} from '@reviewpal/web/ui';
import type { Result } from '@vladbasin/ts-result';
import { cloneDeep } from 'lodash';
import { useCallback, useMemo } from 'react';

export const useUserForm = (options: UseCrudFormExternalOptionsType<UserAdminApiType>) => {
  const usersAdminApi = useUsersAdminApi();

  const { formik, mode, setMode, isViewing, formRef, handleDelete } = useCrudForm<UserAdminApiType, UserArgsType>({
    ...options,
    api: usersAdminApi,
    schema: UserArgsTypeSchema,
    getInitialValues: (target) => ({ id: '', email: '', name: '', role: 'user', ...cloneDeep(target) }),
  });

  const fullScreenLoaderPresenter = useFullScreenLoaderPresenter();
  const snackbarPresenter = useSnackbarPresenter();

  const handleRequestPasswordReset = useCallback(
    (userId: string): Result<string> => {
      const lid = fullScreenLoaderPresenter.show();
      return usersAdminApi
        .requestPasswordResetAsync(userId)
        .onSuccess((token) => buildUrl('resetPassword', { token }, true))
        .onSuccessExecute((url) => {
          navigator.clipboard.writeText(url);
          snackbarPresenter.present({
            message: 'Reset link has been successfully generated and copied to your clipboard',
            severity: 'success',
          });
        })
        .onFailure((error) => snackbarPresenter.present({ message: error, severity: 'error' }))
        .onBothExecute(() => fullScreenLoaderPresenter.hide(lid));
    },
    [fullScreenLoaderPresenter, snackbarPresenter, usersAdminApi]
  );

  return useMemo(
    () => ({ formik, mode, setMode, isViewing, formRef, handleDelete, handleRequestPasswordReset }),
    [formik, mode, setMode, isViewing, formRef, handleDelete, handleRequestPasswordReset]
  );
};
