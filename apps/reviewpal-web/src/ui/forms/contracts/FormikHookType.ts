import type { FormikValues, useFormik } from 'formik';

export type FormikHookType<T extends FormikValues> = ReturnType<typeof useFormik<T>>;
