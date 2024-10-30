import type { ObjectSchema } from 'yup';
import { object, ref } from 'yup';
import { IdSchema, PasswordSchema } from '@reviewpal/common/cross-cutting';

export type ResetPasswordArgsType = {
  token: string;
  password: string;
  passwordRepeat: string;
};

export const ResetPasswordArgsTypeSchema: ObjectSchema<ResetPasswordArgsType> = object({
  token: IdSchema,
  password: PasswordSchema,
  passwordRepeat: PasswordSchema.oneOf([ref('password')], 'Passwords must match').label('Password repeat'),
});
