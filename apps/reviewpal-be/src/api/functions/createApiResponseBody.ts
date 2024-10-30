import type { RestApiResponseBodyType } from '@reviewpal/common/api';

export const createApiResponseBody = <T>(body: RestApiResponseBodyType<T>): unknown => body;
