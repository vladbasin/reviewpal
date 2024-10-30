import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import { inject, injectable } from 'inversify';
import type { IPasswordAuthorizer, ITokenAuthorizer } from '@reviewpal/be/business';
import {
  CodedError,
  NotFoundError,
  UnauthorizedError,
  validateSchemaEarlyAsync,
} from '@reviewpal/common/cross-cutting';
import { Result } from '@vladbasin/ts-result';
import { TokenAuthorizerSid, UsersRepositorySid } from '@reviewpal/be/_sids';
import type { IUsersRepository } from '@reviewpal/be/data';
import { ResetPasswordTokenEntity, UserEntity } from '@reviewpal/be/data';
import type {
  ResetPasswordArgsType,
  AuthorizeWithPasswordArgsType,
  AuthorizeWithPasswordResultType,
} from '@reviewpal/common/auth';
import { AuthorizeWithPasswordArgsTypeSchema, ResetPasswordArgsTypeSchema } from '@reviewpal/common/auth';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';

const AdminUserId = '00000000-0000-0000-0000-000000000000';
const SaltLength = 16;
const HashIterations = 10000;
const HashLength = 64;
const HashDigest = 'sha256';
const PasswordSaltSeparator = ':';
const PasswordStringEncoding = 'hex';

@injectable()
export class PasswordAuthorizer implements IPasswordAuthorizer {
  public constructor(
    @inject(UsersRepositorySid) private readonly _usersRepository: IUsersRepository,
    @inject(TokenAuthorizerSid) private readonly _tokenAuthorizer: ITokenAuthorizer
  ) {}

  public initializeAsync(): Result<void> {
    const { ADMIN_INITIAL_EMAIL, ADMIN_INITIAL_PASSWORD, ADMIN_INITIAL_NAME } = process.env;

    if (!ADMIN_INITIAL_EMAIL || !ADMIN_INITIAL_PASSWORD || !ADMIN_INITIAL_NAME) {
      throw new Error('Missing environment variables for admin user initialization');
    }

    return Result.FromPromise(this._usersRepository.findOneOrFail({ where: { id: AdminUserId } })).onFailureCompensate(
      () =>
        this._usersRepository.save(
          new UserEntity({
            id: AdminUserId,
            email: ADMIN_INITIAL_EMAIL,
            password: this.securePassword(ADMIN_INITIAL_PASSWORD),
            name: ADMIN_INITIAL_NAME,
            role: 'admin',
          })
        )
    ).void;
  }

  public authorizeAsync(args: AuthorizeWithPasswordArgsType): Result<AuthorizeWithPasswordResultType> {
    return validateSchemaEarlyAsync(args, AuthorizeWithPasswordArgsTypeSchema, true)
      .onSuccess(() =>
        Result.FromPromise(
          this._usersRepository.findOneOrFail({ where: { email: args.email }, relations: { refreshToken: true } })
        ).withProcessedFailError(
          (error) => new CodedError({ code: NotFoundError, message: 'User not found', originalError: error })
        )
      )
      .onSuccess((user) =>
        this.isPasswordValid(args.password, user.password)
          ? this._tokenAuthorizer.authorizeUserAsync(user)
          : Result.FailWithError(new CodedError({ code: UnauthorizedError, message: 'Invalid password' }))
      );
  }

  public requestPasswordResetTokenAsync(userId: string): Result<ResetPasswordTokenEntity> {
    return this._usersRepository.transactionAsync((manager) => {
      const resetPasswordTokenId = v4();

      const usersRepository = manager.getRepository(UserEntity);
      const resetPasswordTokensRepository = manager.getRepository(ResetPasswordTokenEntity);

      return Result.FromPromise(usersRepository.findOne({ where: { id: userId } }))
        .ensureUnwrapWithError((user) => user, new CodedError({ code: NotFoundError, message: 'User not found' }))
        .onSuccess((user) => {
          user.resetPasswordTokenId = resetPasswordTokenId;

          return Result.FromPromise(
            resetPasswordTokensRepository.upsert(
              new ResetPasswordTokenEntity({
                id: resetPasswordTokenId,
                user,
                userId: user.id,
                createdAt: DateTime.now().toUTC().toJSDate(),
              }),
              { conflictPaths: { userId: true } }
            )
          )
            .onSuccess(() => usersRepository.upsert(user, { conflictPaths: { id: true } }))
            .onSuccess(() => resetPasswordTokensRepository.findOneOrFail({ where: { id: resetPasswordTokenId } }));
        });
    });
  }

  public resetPasswordAsync(args: ResetPasswordArgsType): Result<void> {
    const { token } = args;
    const { RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS } = process.env;

    if (!RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS) {
      throw new Error('Missing environment variable for reset password token expiration');
    }

    return validateSchemaEarlyAsync(args, ResetPasswordArgsTypeSchema, true)
      .onSuccess(() =>
        Result.FromPromise(
          this._usersRepository.findOne({
            where: { resetPasswordTokenId: token },
            relations: { resetPasswordToken: true },
          })
        )
      )
      .ensureUnwrap((user) => user, NotFoundError)
      .onSuccess((user) =>
        Result.Ok(user.resetPasswordToken)
          .ensureUnwrap((resetPasswordToken) => resetPasswordToken, NotFoundError)
          .ensure(
            (resetPasswordToken) =>
              DateTime.fromJSDate(resetPasswordToken.createdAt).plus({
                seconds: parseInt(RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS),
              }) > DateTime.now().toUTC(),
            NotFoundError
          )
          .onSuccess((resetPasswordToken) =>
            this._usersRepository.transactionAsync((manager) => {
              const usersRepository = manager.getRepository(UserEntity);
              const resetPasswordTokensRepository = manager.getRepository(ResetPasswordTokenEntity);

              return Result.FromPromise(
                usersRepository.update(user.id, { password: this.securePassword(args.password) })
              ).onSuccess(() => resetPasswordTokensRepository.delete(resetPasswordToken.id));
            })
          )
      ).void;
  }

  private securePassword(rawPassword: string): string {
    const salt = randomBytes(SaltLength).toString(PasswordStringEncoding);
    return `${this.hashPassword(rawPassword, salt)}${PasswordSaltSeparator}${salt}`;
  }

  private hashPassword(rawPassword: string, salt: string): string {
    return pbkdf2Sync(rawPassword, salt, HashIterations, HashLength, HashDigest).toString(PasswordStringEncoding);
  }

  private isPasswordValid(attemptedPassword: string, hashedPasswordWithSalt: string): boolean {
    const [hashedPassword, salt] = hashedPasswordWithSalt.split(PasswordSaltSeparator);
    const passwordHash = this.hashPassword(attemptedPassword, salt);
    const hashedPasswordBuffer = Buffer.from(hashedPassword, PasswordStringEncoding);
    const passwordHashBuffer = Buffer.from(passwordHash, PasswordStringEncoding);

    return timingSafeEqual(hashedPasswordBuffer, passwordHashBuffer);
  }
}
