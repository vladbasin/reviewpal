import { string } from 'yup';

export const ReviewerConfigNameSchema = string().required().label('Name');
