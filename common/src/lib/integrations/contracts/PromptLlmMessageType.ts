import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

export type PromptLlmMessageType = {
  content: string;
  role: PromptLlmMessageRoleType;
};

export enum PromptLlmMessageRole {
  user = 'user',
  assistant = 'assistant',
}

export type PromptLlmMessageRoleType = keyof typeof PromptLlmMessageRole;

export const PromptLlmMessageTypeSchema: ObjectSchema<PromptLlmMessageType> = object({
  content: string().required().label('Content'),
  role: string().oneOf(Object.values(PromptLlmMessageRole)).required().label('Role'),
});
