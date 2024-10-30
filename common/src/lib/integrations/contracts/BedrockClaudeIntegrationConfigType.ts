import type { ObjectSchema } from 'yup';
import { number, object, string } from 'yup';

export type BedrockClaudeIntegrationConfigType = {
  awsRegion: string;
  modelId: string;
  maxTokens: number;
  anthropicVersion: string;
};

export const BedrockClaudeIntegrationConfigDefault: BedrockClaudeIntegrationConfigType = {
  awsRegion: 'us-east-1',
  modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  maxTokens: 4096,
  anthropicVersion: 'bedrock-2023-05-31',
};

export const BedrockClaudeIntegrationConfigTypeSchema: ObjectSchema<BedrockClaudeIntegrationConfigType> = object({
  awsRegion: string().required().label('AWS Region'),
  modelId: string().required().label('Model ID'),
  maxTokens: number().required().label('Max Tokens'),
  anthropicVersion: string().required().label('Anthropic Version'),
});
