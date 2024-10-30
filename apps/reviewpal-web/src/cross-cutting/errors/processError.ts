import {
  ForbiddenError,
  InvalidInputError,
  NotFoundError,
  UnauthorizedError,
  UnprocessedCodedError,
} from '@reviewpal/common/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';

const defaultErrorsMap: Record<string, string> = {
  [NotFoundError]: 'Data was not found',
  [UnauthorizedError]: 'You are not authorized',
  [InvalidInputError]: 'Invalid input',
  [ForbiddenError]: "You don't have permissions",
};

export const processError = (error: Error, customErrorsMap?: Record<string, string>): Error => {
  let result: Maybe<string>;

  if (error instanceof UnprocessedCodedError) {
    const detailsMessage = error.details ? getMessageForErrorString(error.details, customErrorsMap) : undefined;
    result = detailsMessage ?? getMessageForErrorString(error.code, customErrorsMap);
  } else {
    result = getMessageForErrorString(error.message, customErrorsMap);
  }

  return new Error(result ?? 'Unexpected error occurred');
};

const getMessageForErrorString = (error: string, customErrorsMap: Maybe<Record<string, string>>) => {
  let result = customErrorsMap?.[error];

  if (!result) {
    result = defaultErrorsMap[error];
  }

  return result;
};
