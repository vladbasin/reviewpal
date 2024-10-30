import type { IInitializable } from '@reviewpal/common/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';

export interface ICrypter extends IInitializable {
  encrypt(plainText: string): string;
  decrypt(encryptedText: string): string;
  secureObject<T extends object>(
    mode: 'encrypt' | 'decrypt' | 'strip',
    source: T,
    secureFields: Maybe<(string | number)[]>
  ): T;
  isStripped(value: string): boolean;
  restoreStrippedObject<T extends object>(targetSource: T, reference: T, secureFields: Maybe<(string | number)[]>): T;
}
