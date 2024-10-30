import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

export type GitHubIntegrationConfigType = {
  token: string;
};

export const GitHubIntegrationConfigDefault: GitHubIntegrationConfigType = {
  token: '',
};

export const GitHubIntegrationConfigTypeSchema: ObjectSchema<GitHubIntegrationConfigType> = object({
  token: string().required().label('Token'),
});
