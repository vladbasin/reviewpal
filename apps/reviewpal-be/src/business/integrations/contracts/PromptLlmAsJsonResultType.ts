export type PromptLlmAsJsonResultType<TJson extends object> = {
  json: TJson;
  inputTokens: number;
  outputTokens: number;
};
