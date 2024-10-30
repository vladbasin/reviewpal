import { InteractivePrReviewerDefaultSystemPrompt } from '@reviewpal/common/reviewers';
import type { ObjectSchema } from 'yup';
import { boolean, number, object, string } from 'yup';

export type InteractivePrReviewerConfigType = {
  systemPrompt: string;
  desiredCommentsCountPer100Changes: number;
  filesPerPrompt: number;
  isWatermarkEnabled: boolean;
};

export const InteractivePrReviewerConfigDefault: InteractivePrReviewerConfigType = {
  systemPrompt: InteractivePrReviewerDefaultSystemPrompt,
  desiredCommentsCountPer100Changes: 10,
  filesPerPrompt: 10,
  isWatermarkEnabled: true,
};

export const InteractivePrReviewerConfigTypeSchema: ObjectSchema<InteractivePrReviewerConfigType> = object({
  systemPrompt: string().required().label('System prompt'),
  desiredCommentsCountPer100Changes: number().required().label('Desired comments count per 100 changes'),
  filesPerPrompt: number().required().label('Files per prompt'),
  isWatermarkEnabled: boolean().required().label('Watermark'),
});
