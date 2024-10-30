import {
  ConflictError,
  ForbiddenError,
  InvalidInputError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
  type CodedError,
} from '@reviewpal/common/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';
import { HttpStatusCode } from 'axios';

const errorCodeToStatusCodeMap: Record<string, Maybe<number>> = {
  [UnknownError]: HttpStatusCode.InternalServerError,
  [UnauthorizedError]: HttpStatusCode.Unauthorized,
  [InvalidInputError]: HttpStatusCode.BadRequest,
  [ConflictError]: HttpStatusCode.Conflict,
  [NotFoundError]: HttpStatusCode.NotFound,
  [ForbiddenError]: HttpStatusCode.Forbidden,
};

export const getHttpStatusCodeForCodedError = (errorCode: string): number => {
  return errorCodeToStatusCodeMap[errorCode] ?? HttpStatusCode.InternalServerError;
};
