import { validateYupSchema, yupToFormErrors, type FormikErrors, type FormikValues } from 'formik';
import { useCallback } from 'react';
import type { AnyObject, ObjectSchema } from 'yup';

export const useValidateYupSchema = () => {
  return useCallback(
    <TValues extends FormikValues, TSchema extends AnyObject>(
      values: TValues,
      schema: ObjectSchema<TSchema>
    ): Promise<FormikErrors<TValues>> => {
      const promise = validateYupSchema(values, schema);
      return new Promise((resolve, reject) => {
        promise.then(
          () => {
            resolve({});
          },
          (error) => {
            // Yup will throw a validation error if validation fails. We catch those and
            // resolve them into Formik errors. We can sniff if something is a Yup error
            // by checking error.name.
            // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
            if (error.name === 'ValidationError') {
              resolve(yupToFormErrors(error));
            } else {
              reject(error);
            }
          }
        );
      });
    },
    []
  );
};
