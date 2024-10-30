import type { Result } from '@vladbasin/ts-result';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { createApiResponseBody } from '@reviewpal/be/api';
import { logger } from '@reviewpal/be/cross-cutting';
import type { RestApiSuccessResponseBodyType } from '@reviewpal/common/api';
import { getHttpStatusCodeForCodedError } from '@reviewpal/common/api';
import { CodedError, UnknownError } from '@reviewpal/common/cross-cutting';
import { HttpStatusCode } from 'axios';

export type SuccessHandleResult = { statusCode: number; data?: unknown };

type HandleApiRequestOptionsType = {
  handler: (req: Request, res: Response, next: NextFunction) => Result<SuccessHandleResult | void>;
  sendSuccessResponse: boolean;
};

export const handleApiRequestAsync = ({
  handler,
  sendSuccessResponse,
}: HandleApiRequestOptionsType): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) =>
    handler(req, res, next)
      .onSuccess((result) => {
        if (!sendSuccessResponse) {
          return;
        }

        if (result) {
          const body: RestApiSuccessResponseBodyType<unknown> = { data: result.data, isSuccess: true };
          res.status(result.statusCode).send(body);
        } else {
          res.status(HttpStatusCode.NoContent).send();
        }
      })
      .onFailureCompensateWithError((error) => {
        const messageBasedError =
          getHttpStatusCodeForCodedError(error.message) === HttpStatusCode.InternalServerError
            ? new CodedError({ code: UnknownError, message: 'Unexpected error', originalError: error })
            : new CodedError({ code: error.message, message: error.message, originalError: error });

        const codedError = error instanceof CodedError ? error : messageBasedError;

        if (codedError.code === UnknownError) {
          logger.error(`Unexpected error while handling API request ${req.method} ${req.url}. ${error.stack}`);
        }

        res
          .status(getHttpStatusCodeForCodedError(codedError.code))
          .send(createApiResponseBody({ isSuccess: false, code: codedError.code, details: codedError.details }));
      })
      .void.asPromise();
};
