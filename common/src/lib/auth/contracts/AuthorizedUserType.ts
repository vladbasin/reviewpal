import type { UserRoleType } from '@reviewpal/common/users';

export type AuthorizedUserType = {
  id: string;
  name: string;
  role: UserRoleType;
};
