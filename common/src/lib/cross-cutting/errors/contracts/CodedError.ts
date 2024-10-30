import { ProcessedError } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';

type CodedErrorParamsType = {
  code: string;
  details?: string;
  message: string;
  originalError?: Error;
};

export class CodedError extends ProcessedError {
  public constructor({ code, details, message, originalError }: CodedErrorParamsType) {
    super(message, originalError ?? new Error());

    this.code = code;
    this.details = details;
  }

  public readonly code: string;
  public readonly details: Maybe<string>;
}
