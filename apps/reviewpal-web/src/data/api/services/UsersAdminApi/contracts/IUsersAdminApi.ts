import type { UserArgsType, UserAdminApiType } from '@reviewpal/common/users';
import type { ICrudApi } from '@reviewpal/web/data';
import type { Result } from '@vladbasin/ts-result';

export interface IUsersAdminApi extends ICrudApi<UserAdminApiType, UserArgsType> {
  requestPasswordResetAsync(userId: string): Result<string>;
}
