import type { FormikValues } from 'formik';
import type { FormikHookType } from './FormikHookType';

export type FormFieldBasePropsType<T extends FormikValues = FormikValues> = {
  name: string;
  formik: FormikHookType<T>;
};
