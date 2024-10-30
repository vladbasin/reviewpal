import { string } from 'yup';
import { IntegrationSource } from '@reviewpal/common/integrations';

export const IntegrationSourceSchema = string().oneOf(Object.values(IntegrationSource)).required().label('Source');
