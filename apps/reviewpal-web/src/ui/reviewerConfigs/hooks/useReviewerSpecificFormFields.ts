import type { KeySpecificComponentType } from '@reviewpal/web/ui';
import { InteractivePrReviewerFormFields, useKeySpecificFormFields } from '@reviewpal/web/ui';
import type { Maybe } from '@vladbasin/ts-types';
import type { ReviewerConfigArgsType } from '@reviewpal/common/reviewerConfigs';
import { InteractivePrReviewerName, reviewerConfigReviewersRegistry } from '@reviewpal/common/reviewerConfigs';

const ReviewerToFormFieldsMap: Record<string, Maybe<KeySpecificComponentType<ReviewerConfigArgsType>>> = {
  [InteractivePrReviewerName]: InteractivePrReviewerFormFields,
};

type UseReviewerConfigSpecificFormFieldsOptionsType = {
  reviewer: string;
};

export const useReviewerSpecificFormFields = ({ reviewer }: UseReviewerConfigSpecificFormFieldsOptionsType) =>
  useKeySpecificFormFields({ key: reviewer, map: ReviewerToFormFieldsMap, registry: reviewerConfigReviewersRegistry });
