import type { RestApiFailResponseBodyType, RestApiSuccessResponseBodyType } from '@reviewpal/common/api';

export type RestApiResponseBodyType<T> = RestApiFailResponseBodyType | RestApiSuccessResponseBodyType<T>;
