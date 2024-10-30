import type {} from 'crypto';
import { constants, createSign } from 'crypto';
import type { IRefreshTokensRepository, IUsersRepository } from '@reviewpal/be/data';
import { UserEntity } from '@reviewpal/be/data';
import { RefreshTokenEntity } from '@reviewpal/be/data';
import type { AuthorizedWithTokenResultType, ITokenAuthorizer } from '@reviewpal/be/business';
import { injectable, inject } from 'inversify';
import { Result } from '@vladbasin/ts-result';
import { GetPublicKeyCommand, KMSClient, SignCommand } from '@aws-sdk/client-kms';
import type { JWTPayload, KeyLike } from 'jose';
import { decodeJwt, importSPKI, jwtVerify } from 'jose';
import { RefreshTokensRepositorySid, UsersRepositorySid } from '@reviewpal/be/_sids';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';

const JwtHeader = { alg: 'RS256', typ: 'JWT' };
const JwtKmsSigningAlgorithm = 'RSASSA_PKCS1_V1_5_SHA_256';
const JwtStringEncoding = 'base64url';
const JwtPublicKeyAlgorithm = 'RSA';
const AccessTokenIssuer = 'reviewpal';
const AwsPublicKeyPrefix = '-----BEGIN PUBLIC KEY-----\n';
const AwsPublicKeySuffix = '\n-----END PUBLIC KEY-----';
const AwsPublicKeyEncoding = 'base64';

@injectable()
export class TokenAuthorizer implements ITokenAuthorizer {
  public constructor(
    @inject(UsersRepositorySid) private readonly _usersRepository: IUsersRepository,
    @inject(RefreshTokensRepositorySid) private readonly _refreshTokensRepository: IRefreshTokensRepository
  ) {}

  public initializeAsync(): Result<void> {
    const { ACCESS_TOKEN_PUBLIC_BASE64, ACCESS_TOKEN_PRIVATE_BASE64, ACCESS_TOKEN_AWS_KMS_KEY_ID } = process.env;

    if (ACCESS_TOKEN_PUBLIC_BASE64 && ACCESS_TOKEN_PRIVATE_BASE64) {
      this._privateKey = this.decodeUint8Array(Buffer.from(ACCESS_TOKEN_PRIVATE_BASE64, JwtStringEncoding));
      const configuredPublicKey = this.decodeUint8Array(Buffer.from(ACCESS_TOKEN_PUBLIC_BASE64, JwtStringEncoding));
      return Result.FromPromise(importSPKI(configuredPublicKey, JwtPublicKeyAlgorithm)).onSuccess(
        (key) => (this._publicKey = key)
      ).void;
    }

    if (!ACCESS_TOKEN_AWS_KMS_KEY_ID) {
      throw new Error('Missing environment variable for KMS key ID');
    }

    this._kms = new KMSClient();

    return Result.FromPromise(this._kms.send(new GetPublicKeyCommand({ KeyId: ACCESS_TOKEN_AWS_KMS_KEY_ID })))
      .ensureUnwrap((result) => result.PublicKey, 'Failed to load public token key from KMS')
      .onSuccess((publicKey) => {
        const pemKey = `${AwsPublicKeyPrefix}${Buffer.from(publicKey).toString(
          AwsPublicKeyEncoding
        )}${AwsPublicKeySuffix}`;
        return importSPKI(pemKey, JwtPublicKeyAlgorithm);
      })
      .onSuccess((key) => (this._publicKey = key)).void;
  }

  public authorizeUserAsync(user: UserEntity): Result<AuthorizedWithTokenResultType> {
    return Result.Void()
      .onSuccess(() => this.createAccessTokenAsync(user.id))
      .onSuccess((accessToken) =>
        this._refreshTokensRepository
          .transactionAsync((manager) => {
            const id = v4();
            user.refreshTokenId = id;

            // In transactions typeorm forces to use manager instance provided by a transaction,
            // you cannot use global entity managers or repositories,
            // because this manager is exclusive and transactional
            const refreshTokensRepository = manager.getRepository(RefreshTokenEntity);
            const usersRepository = manager.getRepository(UserEntity);

            return Result.FromPromise(
              refreshTokensRepository.upsert(
                new RefreshTokenEntity({
                  id,
                  user,
                  userId: user.id,
                  createdAt: DateTime.now().toUTC().toJSDate(),
                }),
                { conflictPaths: { userId: true } }
              )
            )
              .onSuccess(() => usersRepository.upsert(user, { conflictPaths: { id: true } }))
              .onSuccess(() => refreshTokensRepository.findOneOrFail({ where: { id } }));
          })
          .onSuccess((refreshToken) => ({ accessToken, refreshToken: refreshToken.id }))
      )
      .onSuccess(({ accessToken, refreshToken }) => ({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      }));
  }

  public authorizeTokensAsync(accessToken: string, refreshToken: string): Result<AuthorizedWithTokenResultType> {
    return Result.Void()
      .onSuccess(() => this.verifyAccessTokenAsync(accessToken, false))
      .onSuccess((payload) => ({ userId: payload.sub, accessToken, refreshToken }))
      .onSuccess(({ accessToken, refreshToken, userId }) =>
        Result.FromPromise(this._usersRepository.findOneOrFail({ where: { id: userId } })).onSuccess((user) => ({
          accessToken,
          refreshToken,
          user: { id: user.id, name: user.name, role: user.role },
        }))
      )
      .onFailureCompensate(() => this.tryRefreshTokenAsync(accessToken, refreshToken));
  }

  public logoutAsync(accessToken: string, refreshToken: string): Result<void> {
    return Result.Void()
      .onSuccess(() => this.verifyAccessTokenAsync(accessToken, false))
      .onSuccess(() => Result.FromPromise(this._refreshTokensRepository.delete({ id: refreshToken }))).void;
  }

  private _kms?: KMSClient;
  private _publicKey?: KeyLike;
  private _privateKey?: string;

  private createAccessTokenAsync(userId: string): Result<string> {
    const { ACCESS_TOKEN_EXPIRATION_SECONDS } = process.env;

    if (!ACCESS_TOKEN_EXPIRATION_SECONDS) {
      throw new Error('Missing environment variables for access token creation');
    }

    const timeNow = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      sub: userId,
      iat: timeNow,
      iss: AccessTokenIssuer,
    };

    const encodedHeader = Buffer.from(JSON.stringify(JwtHeader)).toString(JwtStringEncoding);
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(JwtStringEncoding);

    const message = `${encodedHeader}.${encodedPayload}`;

    return this.signTokenDataAsync(message).onSuccess((signature) => `${message}.${signature}`);
  }

  private signTokenDataAsync(message: string): Result<string> {
    const { ACCESS_TOKEN_AWS_KMS_KEY_ID } = process.env;

    if (this._kms) {
      const command = new SignCommand({
        KeyId: ACCESS_TOKEN_AWS_KMS_KEY_ID,
        Message: Buffer.from(message),
        MessageType: 'RAW',
        SigningAlgorithm: JwtKmsSigningAlgorithm,
      });

      return Result.FromPromise(this._kms.send(command))
        .ensureUnwrap((result) => result.Signature, 'Failed to sign token')
        .onSuccess((signature) => Buffer.from(signature).toString(JwtStringEncoding));
    } else {
      if (!this._privateKey) {
        throw new Error('Token configuration is invalid');
      }

      const signer = createSign('RSA-SHA256');
      signer.update(message);
      signer.end();

      return Result.Ok(
        signer.sign(
          {
            key: this._privateKey,
            padding: constants.RSA_PKCS1_PADDING,
          },
          'base64url'
        )
      );
    }
  }

  private verifyAccessTokenAsync(token: string, allowExpired: boolean): Result<JWTPayload> {
    const { ACCESS_TOKEN_EXPIRATION_SECONDS } = process.env;

    if (!this._publicKey || !ACCESS_TOKEN_EXPIRATION_SECONDS) {
      throw new Error('Token configuration is invalid');
    }

    const payload = decodeJwt(token);

    return Result.FromPromise(
      jwtVerify(token, this._publicKey, {
        issuer: AccessTokenIssuer,
        maxTokenAge: parseInt(ACCESS_TOKEN_EXPIRATION_SECONDS),
        currentDate:
          allowExpired === true ? DateTime.fromMillis((payload.iat ?? 0) * 1000).toJSDate() : DateTime.now().toJSDate(),
      })
    ).onSuccess((result) => result.payload);
  }

  private tryRefreshTokenAsync(accessToken: string, refreshToken: string): Result<AuthorizedWithTokenResultType> {
    const { REFRESH_TOKEN_EXPIRATION_SECONDS } = process.env;

    if (!REFRESH_TOKEN_EXPIRATION_SECONDS) {
      throw new Error('Missing environment variable for refresh token expiration');
    }

    return this.verifyAccessTokenAsync(accessToken, true).onSuccess((payload) =>
      Result.FromPromise(
        this._refreshTokensRepository.findOneOrFail({ where: { id: refreshToken }, relations: { user: true } })
      )
        .ensure(
          (dbRefreshToken) => dbRefreshToken.id === refreshToken && dbRefreshToken.userId === payload.sub,
          'Invalid refresh token'
        )
        .ensure(
          (dbRefreshToken) =>
            DateTime.fromJSDate(dbRefreshToken.createdAt).plus({
              seconds: parseInt(REFRESH_TOKEN_EXPIRATION_SECONDS),
            }) > DateTime.now().toUTC(),
          'Refresh token expired'
        )
        .ensureUnwrap((dbRefreshToken) => dbRefreshToken.user, 'User not found')
        .onSuccess((user) => this.authorizeUserAsync(user))
    );
  }

  private decodeUint8Array(data: Uint8Array): string {
    return new TextDecoder('utf-8').decode(data);
  }
}
