import type { UserEntity } from '@reviewpal/be/data';
import type { UserAdminApiType } from '@reviewpal/common/users';

export const mapUserEntityToAdminApiItem = (user: UserEntity): UserAdminApiType => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});
