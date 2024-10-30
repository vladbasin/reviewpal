import { UsersRepositorySid } from '@reviewpal/be/_sids';
import type { UserEntity, IUsersRepository } from '@reviewpal/be/data';
import { CodedError, InvalidInputError } from '@reviewpal/common/cross-cutting';
import type { UserArgsType } from '@reviewpal/common/users';
import { EmailExistsError } from '@reviewpal/common/users';
import { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';
import type { IUsersValidator } from '@reviewpal/be/business';
import { isNil } from 'lodash';
import type { Nullable } from '@vladbasin/ts-types';

@injectable()
export class UsersValidator implements IUsersValidator {
  public constructor(@inject(UsersRepositorySid) private readonly _usersRepository: IUsersRepository) {}

  public validateCreateArgsAsync({ email }: UserArgsType): Result<void> {
    return this.validateEmailReuseAsync(email, (user) => isNil(user));
  }

  public validateUpdateArgsAsync(id: string, { email }: UserArgsType): Result<void> {
    return this.validateEmailReuseAsync(email, (user) => isNil(user) || user.id === id);
  }

  private validateEmailReuseAsync(email: string, isValid: (user: Nullable<UserEntity>) => boolean): Result<void> {
    return Result.FromPromise(this._usersRepository.findOneBy({ email })).onSuccess((user) =>
      isValid(user)
        ? Result.Void()
        : Result.FailWithError(
            new CodedError({ code: InvalidInputError, details: EmailExistsError, message: EmailExistsError })
          )
    );
  }
}
