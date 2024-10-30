import type { MaybeNullable } from '@vladbasin/ts-types';
import type { Result } from '@vladbasin/ts-result';

export interface ISecretsProvider {
  provideSecretAsync(keyId: MaybeNullable<string>, plainValue: MaybeNullable<string>): Result<string>;
}
