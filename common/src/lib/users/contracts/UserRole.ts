import { string } from 'yup';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export type UserRoleType = keyof typeof UserRole;

export const UserRoleTypeSchema = string().oneOf(Object.values(UserRole)).required().label('Role');
