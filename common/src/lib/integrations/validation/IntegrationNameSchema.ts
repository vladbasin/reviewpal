import { string } from 'yup';

export const IntegrationNameSchema = string().required().label('Name');
