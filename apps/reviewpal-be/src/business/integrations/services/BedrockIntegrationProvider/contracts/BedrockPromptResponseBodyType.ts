import type { StopReason } from '@aws-sdk/client-bedrock-runtime';

export type BedrockPromptResponseBodyType = {
  id: string;
  type: string;
  role: string;
  model: string;
  content: (BedrockPromptResponseBodyTextMessageType | BedrockPromptResponseBodyToolUseMessageType)[];
  stop_reason: StopReason;
  stop_sequence?: string[];
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
};

export type BedrockPromptResponseBodyToolUseMessageType = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type BedrockPromptResponseBodyTextMessageType = {
  type: 'text';
  text: string;
};
