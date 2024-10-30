import { injectable } from 'inversify';
import type {
  BedrockPromptResponseBodyType,
  ILlmIntegrationProvider,
  PromptLlmAsChatArgsType,
  PromptLlmAsChatResultType,
  PromptLlmAsJsonArgsType,
  PromptLlmAsJsonResultType,
} from '@reviewpal/be/business';
import { Result } from '@vladbasin/ts-result';
import { BedrockClaudeIntegrationProviderName } from '@reviewpal/common/integrations';
import type { BedrockClaudeIntegrationConfigType, PromptLlmMessageType } from '@reviewpal/common/integrations';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { CodedError, UnknownError } from '@reviewpal/common/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';

@injectable()
export class BedrockIntegrationProvider implements ILlmIntegrationProvider {
  public get name(): string {
    return BedrockClaudeIntegrationProviderName;
  }

  public promptAsJsonAsync<TJson extends object>({
    integration,
    systemPrompt,
    messages,
    jsonFunction,
  }: PromptLlmAsJsonArgsType<TJson>): Result<PromptLlmAsJsonResultType<TJson>> {
    const { awsRegion, modelId, maxTokens, anthropicVersion } =
      integration.config as BedrockClaudeIntegrationConfigType;

    const client = new BedrockRuntimeClient({
      region: awsRegion,
    });

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify({
        system: systemPrompt,
        messages,
        max_tokens: maxTokens,
        anthropic_version: anthropicVersion,
        tools: [
          {
            name: jsonFunction.name,
            description: jsonFunction.description,
            input_schema: jsonFunction.jsonSchema,
          },
        ],
      }),
    });

    return Result.FromPromise(client.send(command))
      .onSuccess((response) => JSON.parse(new TextDecoder().decode(response.body)) as BedrockPromptResponseBodyType)
      .ensureWithError(
        (response) => response.stop_reason === 'tool_use',
        new CodedError({ code: UnknownError, message: 'LLM did not use tool (function)' })
      )
      .onSuccess((response) => {
        const targetMessage = response.content
          .filter((message) => message.type === 'tool_use')
          .find((message) => message.name === jsonFunction.name);

        if (!targetMessage) {
          return Result.FailWithError(
            new CodedError({ code: UnknownError, message: 'LLM did not use tool (function)' })
          );
        }

        const json = targetMessage.input as TJson;

        return Result.FromPromise(jsonFunction.validationSchema.validate(json, { strict: true })).onSuccess(
          (): PromptLlmAsJsonResultType<TJson> => ({
            json,
            inputTokens: response.usage?.input_tokens ?? 0,
            outputTokens: response.usage?.output_tokens ?? 0,
          })
        );
      });
  }

  public promptAsChatAsync({
    integration,
    systemPrompt,
    messages,
  }: PromptLlmAsChatArgsType): Result<PromptLlmAsChatResultType> {
    const { awsRegion, modelId, maxTokens, anthropicVersion } =
      integration.config as BedrockClaudeIntegrationConfigType;

    const client = new BedrockRuntimeClient({
      region: awsRegion,
    });

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify({
        system: systemPrompt,
        // Bedrock expects roles to alternate between "user" and "assistant", but we may have multiple user messages if previous requests failed so we will aggregate them
        messages: this.compressUserMessages(messages),
        max_tokens: maxTokens,
        anthropic_version: anthropicVersion,
      }),
    });

    return Result.FromPromise(client.send(command))
      .onSuccess((response) => JSON.parse(new TextDecoder().decode(response.body)) as BedrockPromptResponseBodyType)
      .ensureWithError(
        (json) => json.stop_reason === 'end_turn',
        new CodedError({ code: UnknownError, message: 'LLM stopped without end_turn' })
      )
      .onSuccess(({ content, role, usage }) => {
        const lastMessage = content[content.length - 1];

        if (lastMessage.type !== 'text' || role !== 'assistant') {
          return Result.FailWithError(new CodedError({ code: UnknownError, message: 'LLM did not return text' }));
        }

        return {
          assistantMessage: lastMessage.text,
          inputTokens: usage?.input_tokens ?? 0,
          outputTokens: usage?.output_tokens ?? 0,
        };
      });
  }

  private compressUserMessages(messages: PromptLlmMessageType[]): PromptLlmMessageType[] {
    const result: PromptLlmMessageType[] = [];

    let aggregatedUserMessage: Maybe<string>;

    for (const message of messages) {
      if (message.role === 'user') {
        aggregatedUserMessage = `${aggregatedUserMessage ?? ''}${message.content}\n`;
      } else {
        if (aggregatedUserMessage) {
          result.push({ role: 'user', content: aggregatedUserMessage });
          aggregatedUserMessage = undefined;
        }

        result.push(message);
      }
    }

    if (aggregatedUserMessage) {
      result.push({ role: 'user', content: aggregatedUserMessage });
    }

    return result;
  }
}
