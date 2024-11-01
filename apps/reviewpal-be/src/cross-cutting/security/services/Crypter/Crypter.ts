import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import type { Result } from '@vladbasin/ts-result';
import { getIn, setIn } from 'formik';
import { cloneDeep } from 'lodash';
import type { ICrypter, ISecretsProvider } from '@reviewpal/be/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';
import { inject, injectable } from 'inversify';
import { SecretsProviderSid } from '@reviewpal/be/_sids';

const IvLength = 12;
const Algorithm = 'aes-256-gcm';
const EncryptionBufferEncoding = 'hex';
const IvEncryptedSeparator = ':';
const StrippedValue = '******';
const KeyEncoding = 'hex';

@injectable()
export class Crypter implements ICrypter {
  public constructor(@inject(SecretsProviderSid) private readonly _secretsProvider: ISecretsProvider) {}

  public initializeAsync(): Result<void> {
    const { CRYPTER_KEY, CRYPTER_KEY_AWS_SECRET_MANAGER_KEY_ID } = process.env;

    return this._secretsProvider
      .provideSecretAsync(CRYPTER_KEY_AWS_SECRET_MANAGER_KEY_ID, CRYPTER_KEY)
      .onSuccess((crypterKey) => (this._key = Buffer.from(crypterKey, KeyEncoding))).void;
  }

  public encrypt(plainText: string): string {
    if (!this._key) {
      throw new Error('Crypter key is not initialized');
    }

    const iv = randomBytes(IvLength);
    const cipher = createCipheriv(Algorithm, this._key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString(EncryptionBufferEncoding)}${IvEncryptedSeparator}${encrypted.toString(
      EncryptionBufferEncoding
    )}${IvEncryptedSeparator}${authTag.toString(EncryptionBufferEncoding)}`;
  }

  public decrypt(encryptedText: string): string {
    if (!this._key) {
      throw new Error('Crypter key is not initialized');
    }

    const [ivHex, encryptedData, authTagHex] = encryptedText.split(IvEncryptedSeparator);
    const iv = Buffer.from(ivHex, EncryptionBufferEncoding);
    const authTag = Buffer.from(authTagHex, EncryptionBufferEncoding);
    const decipher = createDecipheriv(Algorithm, this._key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData, EncryptionBufferEncoding)),
      decipher.final(),
    ]);
    return decrypted.toString();
  }

  public secureObject<T extends object>(
    mode: 'encrypt' | 'decrypt' | 'strip',
    source: T,
    secureFields: Maybe<string[]>
  ): T {
    let target = cloneDeep(source);

    secureFields?.forEach((field) => {
      const fieldValue = getIn(target, field);

      if (!fieldValue) {
        return;
      }

      switch (mode) {
        case 'encrypt':
          target = setIn(target, field, this.encrypt(fieldValue));
          break;
        case 'decrypt':
          target = setIn(target, field, this.decrypt(fieldValue));
          break;
        case 'strip':
          target = setIn(target, field, StrippedValue);
          break;
      }
    });

    return target;
  }

  public isStripped(value: string): boolean {
    return value === StrippedValue;
  }

  public restoreStrippedObject<T extends object>(targetSource: T, reference: T, secureFields: Maybe<string[]>): T {
    let target = cloneDeep(targetSource);

    secureFields?.forEach((field) => {
      const fieldValue = getIn(target, field);

      if (!fieldValue) {
        return;
      }

      let targetFieldValue = getIn(reference, field);

      // Reference field must be always encrypted, so we encrypt target field also
      if (fieldValue !== StrippedValue) {
        targetFieldValue = this.encrypt(fieldValue);
      }

      target = setIn(target, field, targetFieldValue);
    });

    return target;
  }

  private _key?: Buffer;
}
