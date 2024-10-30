import type { UserRoleType } from '@reviewpal/common/users';

export type UserAdminApiType = {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
};
