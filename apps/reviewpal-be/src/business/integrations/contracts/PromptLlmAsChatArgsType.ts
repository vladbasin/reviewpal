import type { PromptLlmMessageType } from '@reviewpal/common/integrations';
import type { IntegrationType } from '@reviewpal/common/integrations';

export type PromptLlmAsChatArgsType = {
  integration: IntegrationType;
  systemPrompt?: string;
  messages: PromptLlmMessageType[];
};
