import {
  AccessTokenCookieName,
  handleApiRequestAsync,
  RefreshTokenCookieName,
  setAuthCookies,
} from '@reviewpal/be/api';
import type { ITokenAuthorizer } from '@reviewpal/be/business';
import type { UserRoleType } from '@reviewpal/common/users';
import { isNil } from 'lodash';
import { CodedError, ForbiddenError, UnauthorizedError } from '@reviewpal/common/cross-cutting';
import type { RequestHandler } from 'express';

export const requireAuth = (tokenAuthorizer: ITokenAuthorizer, havingAnyRole?: UserRoleType[]): RequestHandler =>
  handleApiRequestAsync({
    sendSuccessResponse: false,
    handler: (req, res, next) =>
      tokenAuthorizer
        .authorizeTokensAsync(req.cookies[AccessTokenCookieName], req.cookies[RefreshTokenCookieName])
        .withProcessedFailError(
          (error) => new CodedError({ code: UnauthorizedError, message: 'User is not logged in', originalError: error })
        )
        .ensureWithErrorAsProcessed(
          ({ user }) => isNil(havingAnyRole) || havingAnyRole.includes(user.role),
          new CodedError({ code: ForbiddenError, message: 'Access denied' })
        )
        .onSuccess(({ accessToken, refreshToken, user }) => {
          setAuthCookies(req, res, accessToken, refreshToken);
          req.user = {
            id: user.id,
            name: user.name,
            role: user.role,
          };
          next();
        }),
  });
