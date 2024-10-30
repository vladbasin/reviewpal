import { string } from 'yup';

export const UserNameSchema = string().min(3).max(50).required().label('Name');
