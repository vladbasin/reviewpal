import { string } from 'yup';

export const EmailSchema = string().required().email().label('Email');
