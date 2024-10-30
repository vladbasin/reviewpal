import type { AuthorizedUserType } from '@reviewpal/common/auth';
import { createStateSelector, useStateSelector } from '@reviewpal/web/state';
import type { Maybe } from '@vladbasin/ts-types';

const currentUserSelector = createStateSelector([({ root }) => root.currentUser], (currentUser) => currentUser);

export const useCurrentUser = (): Maybe<AuthorizedUserType> => {
  return useStateSelector(currentUserSelector);
};
