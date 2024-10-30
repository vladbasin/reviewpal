import type { Maybe } from '@vladbasin/ts-types';
import { isNil } from 'lodash';

export const getFirstValidationError = (errors: string | object): Maybe<string> => {
  if (isNil(errors)) {
    return undefined;
  }

  if (typeof errors === 'string') {
    return errors.length > 0 ? errors : undefined;
  }

  if (Array.isArray(errors)) {
    if (errors.length === 0) {
      return undefined;
    }

    for (const error of errors) {
      const firstError = getFirstValidationError(error);

      if (!isNil(firstError)) {
        return firstError;
      }
    }

    return undefined;
  }

  const entries = Object.entries(errors);

  if (entries.length === 0) {
    return undefined;
  }

  for (const entry of entries) {
    const firstError = getFirstValidationError(entry[1]);

    if (!isNil(firstError)) {
      return firstError;
    }
  }

  return undefined;
};
