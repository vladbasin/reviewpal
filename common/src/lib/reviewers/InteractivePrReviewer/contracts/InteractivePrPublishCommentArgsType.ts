import { IdSchema } from '@reviewpal/common/cross-cutting';
import { PrCommentSide, type PrCommentSideType } from '@reviewpal/common/integrations';
import type { ObjectSchema } from 'yup';
import { number, object, string } from 'yup';

export type InteractivePrPublishCommentArgsType = {
  reviewerId: string;
  url: string;
  filename: string;
  content: string;
  line: number;
  sha: string;
  side?: PrCommentSideType;
};

export const InteractivePrPublishCommentArgsTypeSchema: ObjectSchema<InteractivePrPublishCommentArgsType> = object({
  reviewerId: IdSchema,
  url: string().url().required().label('Url'),
  filename: string().required().label('Filename'),
  content: string().required().label('Content'),
  line: number().required().label('Line'),
  sha: string().required().label('Sha'),
  side: string().optional().oneOf(Object.values(PrCommentSide)).label('Side'),
});
