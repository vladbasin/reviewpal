import type { Grid2Props, StackProps } from '@mui/material';
import { Alert, Grid2, Stack, Typography } from '@mui/material';
import type { FormikHookType } from '@reviewpal/web/ui';
import { formAlertStyle, formBaseStyle, formMiddleScreenStyle, useCombinedStyle } from '@reviewpal/web/ui';
import { getFirstValidationError } from '@reviewpal/common/cross-cutting';
import type { FormikValues } from 'formik';
import { Form as FormikForm, FormikProvider } from 'formik';
import { isNil } from 'lodash';
import type { Ref } from 'react';
import { useCallback, useMemo } from 'react';

type FormPropsType<T extends FormikValues = FormikValues> = (
  | (StackProps & {
      type: 'stack';
    })
  | (Grid2Props & {
      type: 'grid';
    })
) & {
  forwardRef?: Ref<HTMLElement>;
  middleScreen?: boolean;
  formik: FormikHookType<T>;
};

export const Form = <T extends FormikValues = FormikValues>({
  forwardRef,
  formik,
  type,
  children,
  sx,
  middleScreen,
  ...restProps
}: FormPropsType<T>) => {
  const { setStatus, handleSubmit, submitCount, isSubmitting, status } = formik;

  const firstError = useMemo(() => getFirstValidationError(formik.errors), [formik.errors]);
  const errorSummary = useMemo(() => (firstError ? firstError : formik.status), [firstError, formik.status]);
  const errorSummaryMarkup = useMemo(
    () =>
      !isNil(errorSummary) && (
        <Alert severity="error" variant="standard" square sx={formAlertStyle}>
          <Typography>{errorSummary}</Typography>
        </Alert>
      ),
    // Disabling eslint dependencies check, because it's intended to be updated only after submit attempt to avoid UI 'jumping'
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submitCount, isSubmitting, status]
  );

  const targetSx = useCombinedStyle(sx, formBaseStyle, middleScreen ? formMiddleScreenStyle : undefined);

  const handleSubmitInner = useCallback(
    (e?: React.FormEvent<HTMLFormElement> | undefined) => {
      setStatus(undefined);
      handleSubmit(e);
    },
    [setStatus, handleSubmit]
  );

  return (
    <FormikProvider value={formik}>
      {type === 'grid' ? (
        <Grid2
          ref={forwardRef}
          component={FormikForm}
          container
          direction="column"
          onSubmit={handleSubmitInner}
          sx={targetSx}
          {...restProps}
        >
          <Grid2>{errorSummaryMarkup}</Grid2>
          {children}
        </Grid2>
      ) : (
        <Stack
          ref={forwardRef}
          component={FormikForm}
          direction="column"
          spacing={3}
          alignItems="center"
          onSubmit={formik.handleSubmit}
          sx={targetSx}
          {...restProps}
        >
          {errorSummaryMarkup}
          {children}
        </Stack>
      )}
    </FormikProvider>
  );
};
