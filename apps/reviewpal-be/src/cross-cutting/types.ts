import type { UserRoleType } from '@reviewpal/common/users';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      name: string;
      role: UserRoleType;
    };
  }
}
