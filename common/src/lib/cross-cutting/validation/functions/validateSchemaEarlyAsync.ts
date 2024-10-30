import { getFirstValidationError, CodedError, InvalidInputError } from '@reviewpal/common/cross-cutting';
import { Result } from '@vladbasin/ts-result';
import { ValidationError, type AnyObject, type Maybe, type ObjectSchema } from 'yup';

export const validateSchemaEarlyAsync = <T extends Maybe<AnyObject>>(
  target: T,
  schema: ObjectSchema<T>,
  processAsInvalidInputCodedError: boolean
): Result<void> => {
  return Result.FromPromise(schema.validate(target, { abortEarly: true, strict: true }))
    .onFailureCompensateWithError((error) =>
      error instanceof ValidationError
        ? Result.Fail(getFirstValidationError(error.errors) ?? 'Unknown validation error')
        : Result.FailWithError(error)
    )
    .onFailureCompensateWithError((error) =>
      Result.FailWithError(
        processAsInvalidInputCodedError
          ? new CodedError({
              code: InvalidInputError,
              details: error.message,
              message: error.message,
              originalError: error,
            })
          : error
      )
    ).void;
};
