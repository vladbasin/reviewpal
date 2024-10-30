import type { UserRoleType } from '@reviewpal/common/users';
import type { Maybe } from '@vladbasin/ts-types';

export type CrudControllerOperationType = {
  auth: false | Maybe<UserRoleType[]>;
  route: string;
};
