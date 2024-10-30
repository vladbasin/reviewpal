import type { RestApiFailResponseBodyType, RestApiSuccessResponseBodyType } from '@reviewpal/common/api';
import {
  ConflictError,
  ForbiddenError,
  NoInternetError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
  UnprocessedCodedError,
} from '@reviewpal/common/cross-cutting';
import type { HttpRequestOptionsType, IHttpClient } from '@reviewpal/web/data';
import { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import axios, { HttpStatusCode } from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable } from 'inversify';
import { isNil } from 'lodash';

const EmptyErrorResponseStatusCodeToErrorMap: Record<number, Maybe<string>> = {
  [HttpStatusCode.Unauthorized]: UnauthorizedError,
  [HttpStatusCode.Forbidden]: ForbiddenError,
  [HttpStatusCode.NotFound]: NotFoundError,
  [HttpStatusCode.Conflict]: ConflictError,
};

@injectable()
export class HttpClient implements IHttpClient {
  public sendJsonDataRequestAsync<T, D = unknown>(
    request: AxiosRequestConfig<D>,
    options?: HttpRequestOptionsType<T, AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>, D>, D>
  ): Result<T> {
    return this.sendRawJsonDataRequestAsync(request, options)
      .onSuccess((response) => response.data?.data)
      .ensureUnwrap((t) => t, UnknownError);
  }

  public sendRawJsonDataRequestAsync<T, D = unknown>(
    request: AxiosRequestConfig<D>,
    options?: HttpRequestOptionsType<T, AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>, D>, D>
  ): Result<AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>>> {
    return this.sendAsync<T, AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>, D>, D>(request, {
      handleError: (rawError) => this.handleJsonError(rawError),
      ...options,
    }).onSuccess((response) => response);
  }

  public sendAsync<T, R = AxiosResponse<T>, D = unknown>(
    request: AxiosRequestConfig<D>,
    options?: HttpRequestOptionsType<T, R, D>
  ): Result<R> {
    if (navigator.onLine === false) {
      return Result.Fail(NoInternetError);
    }

    return Result.FromPromise(axios.request<T, R, D>(request)).onFailureCompensateWithError((rawError) => {
      const axiosError = rawError as AxiosError<T, D>;
      const response = axiosError.response;

      const status = isNil(axiosError.status) ? axiosError.response?.status : axiosError.status;

      if (status === HttpStatusCode.Unauthorized) {
        return Result.Fail(UnauthorizedError);
      }

      const optionsHandleError = options?.handleError;

      if (!response || !optionsHandleError) {
        return Result.Fail(rawError.message);
      }

      return optionsHandleError(axiosError, response as R);
    });
  }

  private handleJsonError<T, R = AxiosResponse<T>, D = unknown>(rawError: AxiosError<T, D>): Result<R> {
    const response = rawError.response;
    const failResponse = response?.data as RestApiFailResponseBodyType;

    if (!response) {
      return Result.Fail(UnknownError);
    }

    if (!failResponse?.code) {
      const defaultError = EmptyErrorResponseStatusCodeToErrorMap[response.status];
      return defaultError ? Result.Fail(defaultError) : Result.Fail(UnknownError);
    } else {
      return Result.FailWithError(
        new UnprocessedCodedError({
          code: failResponse.code,
          details: failResponse.details,
          message: failResponse.code,
        })
      );
    }
  }
}
