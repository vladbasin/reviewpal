import type { Result } from '@vladbasin/ts-result';
import type {
  IIntegrationProvider,
  PromptLlmAsChatArgsType,
  PromptLlmAsChatResultType,
  PromptLlmAsJsonArgsType,
  PromptLlmAsJsonResultType,
} from '@reviewpal/be/business';

export interface ILlmIntegrationProvider extends IIntegrationProvider {
  promptAsJsonAsync<TJson extends object>(
    args: PromptLlmAsJsonArgsType<TJson>
  ): Result<PromptLlmAsJsonResultType<TJson>>;
  promptAsChatAsync(args: PromptLlmAsChatArgsType): Result<PromptLlmAsChatResultType>;
}
