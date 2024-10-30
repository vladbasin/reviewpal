import { object, type ObjectSchema } from 'yup';
import {
  ReviewerConfigConfigSchema,
  ReviewerConfigIntegrationsSchema,
  ReviewerConfigNameSchema,
  ReviewerConfigReviewerSchema,
} from '@reviewpal/common/reviewerConfigs';
import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { IntegrationSourceType } from '@reviewpal/common/integrations';

export type ReviewerConfigArgsType = {
  name: string;
  reviewer: string;
  config: object;
  integrations: ReviewerConfigArgsIntegrationType[];
};

export type ReviewerConfigArgsIntegrationType = IdentifiableType & { source: IntegrationSourceType };

export const ReviewerConfigArgsTypeSchema: ObjectSchema<ReviewerConfigArgsType> = object({
  name: ReviewerConfigNameSchema,
  reviewer: ReviewerConfigReviewerSchema,
  config: ReviewerConfigConfigSchema,
  integrations: ReviewerConfigIntegrationsSchema,
});
