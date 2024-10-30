import type { HttpRequestOptionsType } from '@reviewpal/web/data';
import type { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import type { RestApiSuccessResponseBodyType } from '@reviewpal/common/api';

export interface IHttpClient {
  sendAsync<T, R = AxiosResponse<T>, D = unknown>(
    request: AxiosRequestConfig<D>,
    options?: HttpRequestOptionsType<T, R, D>
  ): Result<R>;
  sendJsonDataRequestAsync<T, D = unknown>(
    request: AxiosRequestConfig<D>,
    options?: HttpRequestOptionsType<T, AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>, D>, D>
  ): Result<T>;
  sendRawJsonDataRequestAsync<T, D = unknown>(
    request: AxiosRequestConfig<D>,
    options?: HttpRequestOptionsType<T, AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>, D>, D>
  ): Result<AxiosResponse<Maybe<RestApiSuccessResponseBodyType<T>>>>;
}
