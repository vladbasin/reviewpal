import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import type { Maybe } from '@vladbasin/ts-types';
import type { Ref, PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormikHookType, FormModeType } from '@reviewpal/web/ui';
import { Form, formDialogActionsContainerStyle } from '@reviewpal/web/ui';
import type { FormikValues } from 'formik';
import { isNil } from 'lodash';

type FormDialogPropsType<TTarget, TModel extends FormikValues> = PropsWithChildren<{
  targetType: string;
  target: Maybe<TTarget>;
  targetNameGetter: (target: TTarget) => string;
  isOpen: boolean;
  formik: FormikHookType<TModel>;
  onClose: () => void;
  onModeChanged?: (mode: FormModeType) => void;
  formRef?: Ref<HTMLElement>;
  onDelete?: (item: TTarget) => void;
}>;

export const FormDialog = <TTarget, TModel extends FormikValues>({
  isOpen,
  target,
  targetType,
  targetNameGetter,
  formik,
  children,
  onClose,
  onModeChanged,
  formRef,
  onDelete,
}: FormDialogPropsType<TTarget, TModel>) => {
  const { handleSubmit } = formik;

  const [mode, setMode] = useState<FormModeType>('view');
  const getValidMode = useCallback(
    (preferredMode: FormModeType) => {
      const isImpossibleEditMode = isNil(target) && preferredMode !== 'create';
      if (isImpossibleEditMode) {
        return 'create';
      }
      const isImpossibleCreateMode = !isNil(target) && preferredMode !== 'update';
      if (isImpossibleCreateMode) {
        return 'view';
      }
      return preferredMode;
    },
    [target]
  );
  const toggleMode = useCallback(
    (forceToView?: boolean) => {
      const onMode = target ? 'update' : 'create';
      const expectedMode = mode === 'view' ? onMode : 'view';
      const resultMode: FormModeType = getValidMode(forceToView === true ? 'view' : expectedMode);

      if (resultMode !== mode) {
        setMode(resultMode);
      }
    },
    [mode, target, getValidMode]
  );
  useEffect(() => setMode(getValidMode(mode)), [mode, getValidMode]);
  useEffect(() => onModeChanged?.(mode), [mode, onModeChanged]);

  const isViewing = useMemo(() => mode === 'view', [mode]);

  const title = useMemo(() => {
    if (!target) {
      return `Create ${targetType}`;
    } else {
      return `${mode === 'view' ? '' : 'Edit'} ${targetNameGetter(target)}`;
    }
  }, [target, targetNameGetter, targetType, mode]);

  const isDeleteConfigured = useMemo(() => !isNil(target) && !isNil(onDelete), [target, onDelete]);
  const handleDeleteClick = useCallback(() => target && onDelete?.(target), [onDelete, target]);
  const handleEditClick = useCallback(() => toggleMode(), [toggleMode]);
  const handleClose = useCallback(() => {
    toggleMode(true);
    onClose();
  }, [onClose, toggleMode]);
  const handleSave = useCallback(() => handleSubmit(), [handleSubmit]);
  const handleCancelEdit = useCallback(() => onClose(), [onClose]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Form forwardRef={formRef} type="stack" formik={formik}>
          {children}
        </Form>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={formDialogActionsContainerStyle}>
          {isViewing ? (
            <Stack direction="row" spacing={2}>
              <Button onClick={handleClose}>Close</Button>
              {isDeleteConfigured && (
                <Button color="error" variant="contained" onClick={handleDeleteClick}>
                  Delete
                </Button>
              )}
              <Button color="info" variant="contained" onClick={handleEditClick}>
                Edit
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button color="error" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
