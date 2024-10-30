import { getIn, type FormikValues } from 'formik';
import { useMemo } from 'react';
import type { FormFieldDataType, FormikHookType } from '@reviewpal/web/ui';

export const useFormFieldData = <TValues extends FormikValues, TValue = unknown>(
  name: string,
  { values, touched, errors }: FormikHookType<TValues>
): FormFieldDataType<TValue> => {
  return useMemo(() => {
    const valueForName = getIn(values, name) as TValue;
    const touchedForName = getIn(touched, name);
    const errorForName = getIn(errors, name);
    const hasError = touched ? Boolean(errorForName) : undefined;
    const helperText = hasError ? errorForName : undefined;

    return { value: valueForName, touched: touchedForName, hasError, helperText };
  }, [values, touched, errors, name]);
};
