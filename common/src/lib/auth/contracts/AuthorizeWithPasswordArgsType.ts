import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';
import { EmailSchema } from '@reviewpal/common/cross-cutting';

export type AuthorizeWithPasswordArgsType = {
  email: string;
  password: string;
};

export const AuthorizeWithPasswordArgsTypeSchema: ObjectSchema<AuthorizeWithPasswordArgsType> = object({
  email: EmailSchema,
  password: string().required().label('Password'),
});
