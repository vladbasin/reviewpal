import type { Response, Request, CookieOptions } from 'express';

export const setCookieIfChanged = (
  req: Request,
  res: Response,
  name: string,
  value: string,
  options: CookieOptions
): void => {
  if (req.cookies[name] !== value) {
    res.cookie(name, value, options);
  }
};
