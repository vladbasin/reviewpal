import { string } from 'yup';

export const PasswordSchema = string().required().min(5).label('Password');
