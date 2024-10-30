import type { AuthorizedUserType } from '@reviewpal/common/auth';

export type AuthorizedWithTokenResultType = {
  accessToken: string;
  refreshToken: string;
  user: AuthorizedUserType;
};
