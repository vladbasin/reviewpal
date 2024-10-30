import { AccessTokenCookieName, RefreshTokenCookieName } from '@reviewpal/be/api';
import type { Response } from 'express';

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie(AccessTokenCookieName);
  res.clearCookie(RefreshTokenCookieName);
};
