import type { UserArgsType } from '@reviewpal/common/users';
import type { Result } from '@vladbasin/ts-result';

export interface IUsersValidator {
  validateCreateArgsAsync(args: UserArgsType): Result<void>;
  validateUpdateArgsAsync(id: string, args: UserArgsType): Result<void>;
}
