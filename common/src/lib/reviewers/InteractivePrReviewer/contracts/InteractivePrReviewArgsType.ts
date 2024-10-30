import { IdSchema } from '@reviewpal/common/cross-cutting';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

export type InteractivePrReviewArgsType = {
  reviewerId: string;
  url: string;
  userInstructions?: string;
};

export const InteractivePrReviewArgsTypeSchema: ObjectSchema<InteractivePrReviewArgsType> = object({
  reviewerId: IdSchema,
  url: string().url().required().label('Url'),
  userInstructions: string().optional().label('User instructions'),
});
