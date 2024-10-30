import { EmailSchema } from '@reviewpal/common/cross-cutting';
import { UserRoleTypeSchema, type UserRoleType, UserNameSchema } from '@reviewpal/common/users';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

export type UserArgsType = {
  email: string;
  name: string;
  role: UserRoleType;
};

export const UserArgsTypeSchema: ObjectSchema<UserArgsType> = object({
  email: EmailSchema,
  name: UserNameSchema,
  role: UserRoleTypeSchema,
});
