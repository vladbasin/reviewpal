import { string } from 'yup';
import { reviewerConfigReviewersRegistry } from '@reviewpal/common/reviewerConfigs';

export const ReviewerConfigReviewerSchema = string()
  .oneOf(reviewerConfigReviewersRegistry.getAllNames())
  .required()
  .label('Reviewer');
