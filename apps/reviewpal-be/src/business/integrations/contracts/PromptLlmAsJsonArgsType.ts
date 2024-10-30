import type { ObjectSchema } from 'yup';
import type { JSONSchemaType } from 'ajv';
import type { IntegrationType } from '@reviewpal/common/integrations';
import type { PromptLlmMessageType } from '@reviewpal/common/integrations';

export type PromptLlmAsJsonArgsType<TJson extends object> = {
  integration: IntegrationType;
  systemPrompt?: string;
  messages: PromptLlmMessageType[];
  jsonFunction: {
    name: string;
    description?: string;
    jsonSchema: JSONSchemaType<TJson>;
    validationSchema: ObjectSchema<TJson>;
  };
};
