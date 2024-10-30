import type { ObjectSchema } from 'yup';
import { array, object, string } from 'yup';
import { IdSchema } from '@reviewpal/common/cross-cutting';
import { PrFileTypeSchema, PromptLlmMessageTypeSchema, type PrFileType } from '@reviewpal/common/integrations';
import type { PromptLlmMessageType } from '@reviewpal/common/integrations';

export type InteractivePrDiscussArgsType = {
  reviewerId: string;
  file: PrFileType;
  codeSuggestion: string;
  messages: PromptLlmMessageType[];
};

export const InteractivePrDiscussArgsTypeSchema: ObjectSchema<InteractivePrDiscussArgsType> = object({
  reviewerId: IdSchema,
  file: PrFileTypeSchema,
  codeSuggestion: string().required().label('Code suggestion'),
  messages: array(PromptLlmMessageTypeSchema).required().label('Messages'),
});
