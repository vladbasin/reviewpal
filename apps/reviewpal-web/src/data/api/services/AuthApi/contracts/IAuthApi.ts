import type { AuthorizedUserType, AuthorizeWithPasswordArgsType, ResetPasswordArgsType } from '@reviewpal/common/auth';
import type { Result } from '@vladbasin/ts-result';

export interface IAuthApi {
  authorizeWithPasswordAsync(args: AuthorizeWithPasswordArgsType): Result<AuthorizedUserType>;
  refreshSessionAsync(): Result<AuthorizedUserType>;
  logoutAsync(): Result<void>;
  resetPasswordAsync(args: ResetPasswordArgsType): Result<void>;
}
