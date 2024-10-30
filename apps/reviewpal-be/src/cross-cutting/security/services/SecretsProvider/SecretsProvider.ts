import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Result } from '@vladbasin/ts-result';
import type { MaybeNullable } from '@vladbasin/ts-types';
import type { ISecretsProvider } from '@reviewpal/be/cross-cutting';
import { injectable } from 'inversify';

@injectable()
export class SecretsProvider implements ISecretsProvider {
  public constructor() {
    this._client = new SecretsManagerClient();
  }

  public provideSecretAsync(keyId: MaybeNullable<string>, plainValue: MaybeNullable<string>): Result<string> {
    return keyId
      ? Result.FromPromise(new SecretsManagerClient().send(new GetSecretValueCommand({ SecretId: keyId })))
          .onSuccess(({ SecretString }) => SecretString)
          .ensureUnwrap(
            (value) => value,
            `SecretString value for ${keyId} was not returned. Binary secrets are not supported.`
          )
      : Result.Ok(plainValue).ensureUnwrap(
          (value) => value,
          `${keyId} is not defined, and no plainValue was provided.`
        );
  }

  private _client: SecretsManagerClient;
}
