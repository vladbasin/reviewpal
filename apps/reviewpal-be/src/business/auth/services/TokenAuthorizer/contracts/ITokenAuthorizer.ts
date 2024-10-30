import type { AuthorizedWithTokenResultType } from '@reviewpal/be/business';
import type { UserEntity } from '@reviewpal/be/data';
import type { IInitializable } from '@reviewpal/common/cross-cutting';
import type { Result } from '@vladbasin/ts-result';

export interface ITokenAuthorizer extends IInitializable {
  authorizeUserAsync(user: UserEntity): Result<AuthorizedWithTokenResultType>;
  authorizeTokensAsync(accessToken: string, refreshToken: string): Result<AuthorizedWithTokenResultType>;
  logoutAsync(accessToken: string, refreshToken: string): Result<void>;
}
