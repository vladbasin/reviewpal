import type { ResetPasswordTokenEntity } from '@reviewpal/be/data';
import type {
  AuthorizeWithPasswordArgsType,
  AuthorizeWithPasswordResultType,
  ResetPasswordArgsType,
} from '@reviewpal/common/auth';
import type { IInitializable } from '@reviewpal/common/cross-cutting';
import type { Result } from '@vladbasin/ts-result';

export interface IPasswordAuthorizer extends IInitializable {
  initializeAsync(): Result<void>;
  authorizeAsync(args: AuthorizeWithPasswordArgsType): Result<AuthorizeWithPasswordResultType>;
  requestPasswordResetTokenAsync(userId: string): Result<ResetPasswordTokenEntity>;
  resetPasswordAsync(args: ResetPasswordArgsType): Result<void>;
}
