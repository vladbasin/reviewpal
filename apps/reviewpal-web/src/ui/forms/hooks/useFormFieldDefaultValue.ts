import type { FormikValues } from 'formik';
import type { FormikHookType, FormModeType } from '@reviewpal/web/ui';
import { useEffect } from 'react';

type UseFormFieldDefaultValueOptionsType<TValues extends FormikValues> = {
  fieldName: string;
  formik: FormikHookType<TValues>;
  defaultValue: object;
  mode: FormModeType;
};

export const useFormFieldDefaultValue = <TValues extends FormikValues>({
  formik,
  fieldName,
  defaultValue,
  mode,
}: UseFormFieldDefaultValueOptionsType<TValues>) => {
  const { setFieldValue } = formik;

  useEffect(() => {
    if (mode === 'create') {
      setFieldValue(fieldName, defaultValue, false);
    }
  }, [setFieldValue, fieldName, defaultValue, mode]);
};
