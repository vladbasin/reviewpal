import { useCurrentInAppLocation, useCurrentUser, useTypedNavigate } from '@reviewpal/web/ui';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isNil } from 'lodash';
import type { UserRoleType } from '@reviewpal/common/users';

type RequiredStatusType = 'onlyAuthorized' | 'onlyNotAuthorized' | UserRoleType[];
const LoginRedirectQueryParamName = 'redirect';

export const withAuth = <TProps extends Record<string, unknown>>(
  requiredStatus: RequiredStatusType,
  Component: FunctionComponent<TProps>
) => {
  return (props: TProps) => {
    const [mustRenderComponent, setMustRenderComponent] = useState(false);
    const currentUser = useCurrentUser();
    const typedNavigate = useTypedNavigate();
    const navigate = useNavigate();
    const inAppLocation = useCurrentInAppLocation();
    const [searchParams] = useSearchParams();
    const redirectParam = searchParams.get(LoginRedirectQueryParamName);

    useEffect(() => {
      const isStatusSatisfied =
        (!isNil(currentUser) && requiredStatus === 'onlyAuthorized') ||
        (isNil(currentUser) && requiredStatus === 'onlyNotAuthorized') ||
        (Array.isArray(requiredStatus) && !isNil(currentUser) && requiredStatus.includes(currentUser.role));

      if (isStatusSatisfied) {
        setMustRenderComponent(true);
      } else {
        // Checking if we're redirecting from not authorized page to authorized page (e.g. after login)
        if (requiredStatus === 'onlyNotAuthorized' && redirectParam) {
          navigate(redirectParam);
        } else {
          const targetRoute = requiredStatus === 'onlyAuthorized' ? 'login' : 'home';

          typedNavigate(
            targetRoute,
            {},
            targetRoute === 'login' ? { [LoginRedirectQueryParamName]: inAppLocation } : undefined
          );
        }
      }
    }, [currentUser, inAppLocation, navigate, typedNavigate, redirectParam]);

    return mustRenderComponent ? <Component {...props} /> : undefined;
  };
};
