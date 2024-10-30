import { TextField, type TextFieldProps } from '@mui/material';
import type { FormFieldBasePropsType } from '@reviewpal/web/ui';
import { useFormFieldData } from '@reviewpal/web/ui';
import type { FormikValues } from 'formik';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

export type FormTextFieldPropsType<T extends FormikValues = FormikValues> = TextFieldProps & FormFieldBasePropsType<T>;

export const FormTextField = <T extends FormikValues = FormikValues>({
  name,
  formik,
  ...restProps
}: FormTextFieldPropsType<T>): ReactNode => {
  const { value, hasError, helperText } = useFormFieldData(name, formik);
  const { handleBlur, handleChange } = formik;

  return useMemo(
    () => (
      <TextField
        name={name}
        {...restProps}
        value={value}
        error={hasError}
        helperText={helperText}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    ),
    [name, value, hasError, helperText, handleBlur, handleChange, restProps]
  );
};
