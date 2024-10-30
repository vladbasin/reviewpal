import type { Result } from '@vladbasin/ts-result';
import type { AxiosError, AxiosResponse } from 'axios';

export type HttpRequestOptionsType<T, R = AxiosResponse<T>, D = unknown> = {
  handleError?: (error: AxiosError<T, D>, response: R) => Result<R>;
};
