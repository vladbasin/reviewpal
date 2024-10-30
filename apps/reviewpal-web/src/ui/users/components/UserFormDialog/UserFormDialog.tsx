import { Box, Button } from '@mui/material';
import type { UserAdminApiType, UserRoleType } from '@reviewpal/common/users';
import type { OptionType } from '@reviewpal/web/ui';
import { fullWidthStyle, useUserForm } from '@reviewpal/web/ui';
import { FormDialog, FormSelectField, FormTextField } from '@reviewpal/web/ui/forms';
import type { Maybe } from '@vladbasin/ts-types';
import { useCallback, useMemo } from 'react';

type UserFormDialogPropsType = {
  target: Maybe<UserAdminApiType>;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item?: UserAdminApiType) => void;
  onDelete?: (item: UserAdminApiType) => void;
};

export const UserFormDialog = ({ target, isOpen, onClose, onEdit, onDelete }: UserFormDialogPropsType) => {
  const userNameGetter = useCallback((user: UserAdminApiType) => user.name, []);

  const { formik, mode, setMode, isViewing, formRef, handleDelete, handleRequestPasswordReset } = useUserForm({
    target,
    onSuccess: onClose,
    onEdit,
    onDelete,
  });

  const roleOptions = useMemo(
    (): OptionType<UserRoleType>[] => [
      { id: 'user', value: 'user', label: 'User' },
      { id: 'admin', value: 'admin', label: 'Admin' },
    ],
    []
  );
  const roleValueToOptionIdMapper = useCallback((value: UserRoleType) => value, []);

  const handleResetPasswordClick = useCallback(
    () => handleRequestPasswordReset(target?.id ?? '').run(),
    [handleRequestPasswordReset, target?.id]
  );

  return (
    <FormDialog
      formRef={formRef}
      targetType="User"
      target={target}
      targetNameGetter={userNameGetter}
      isOpen={isOpen}
      onClose={onClose}
      onModeChanged={setMode}
      formik={formik}
      onDelete={handleDelete}
    >
      <FormTextField fullWidth autoComplete="name" name="name" label="Name" formik={formik} disabled={isViewing} />
      <FormTextField fullWidth autoComplete="email" name="email" label="Email" formik={formik} disabled={isViewing} />
      <FormSelectField
        fullWidth
        name="role"
        label="Role"
        formik={formik}
        options={roleOptions}
        valueToOptionIdMapper={roleValueToOptionIdMapper}
        disabled={isViewing}
      />
      {mode === 'view' && (
        <Box sx={fullWidthStyle}>
          <Button variant="outlined" onClick={handleResetPasswordClick}>
            Reset password
          </Button>
        </Box>
      )}
    </FormDialog>
  );
};
