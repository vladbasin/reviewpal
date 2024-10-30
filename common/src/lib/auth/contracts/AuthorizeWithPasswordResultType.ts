import type { AuthorizedUserType } from '@reviewpal/common/auth';

export type AuthorizeWithPasswordResultType = {
  accessToken: string;
  refreshToken: string;
  user: AuthorizedUserType;
};
