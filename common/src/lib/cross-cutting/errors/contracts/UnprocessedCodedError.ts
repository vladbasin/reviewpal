import type { Maybe } from '@vladbasin/ts-types';

type UnprocessedCodedErrorParamsType = {
  code: string;
  details?: string;
  message: string;
};

export class UnprocessedCodedError extends Error {
  public constructor({ code, details, message }: UnprocessedCodedErrorParamsType) {
    super(message);

    this.code = code;
    this.details = details;
  }

  public readonly code: string;
  public readonly details: Maybe<string>;
}
