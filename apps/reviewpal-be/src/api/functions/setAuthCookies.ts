import { AccessTokenCookieName, RefreshTokenCookieName, setCookieIfChanged } from '@reviewpal/be/api';
import type { Response, Request, CookieOptions } from 'express';

export const setAuthCookies = (req: Request, res: Response, accessToken: string, refreshToken: string): void => {
  const { USE_SECURE_COOKIES } = process.env;
  const shouldUseSecureCookies = USE_SECURE_COOKIES?.toLowerCase() !== 'false';

  // Secure cookies should be used only in production
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: shouldUseSecureCookies,
    sameSite: shouldUseSecureCookies ? 'strict' : 'lax',
  };

  setCookieIfChanged(req, res, AccessTokenCookieName, accessToken, cookieOptions);
  setCookieIfChanged(req, res, RefreshTokenCookieName, refreshToken, cookieOptions);
};
