import type { Maybe } from '@vladbasin/ts-types';

export type FormFieldDataType<T> = {
  value: T;
  touched: boolean;
  hasError: Maybe<boolean>;
  helperText: string;
};
