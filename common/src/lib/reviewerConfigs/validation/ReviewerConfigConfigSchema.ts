import { object } from 'yup';
import { reviewerConfigReviewersRegistry } from '@reviewpal/common/reviewerConfigs';

export const ReviewerConfigConfigSchema = object()
  .required()
  .when(
    'reviewer',
    ([reviewer], schema) =>
      reviewerConfigReviewersRegistry.get(reviewer)?.schema ??
      schema.test({
        test: () => false,
        message: 'Unknown reviewer',
      })
  )
  .label('Config');
