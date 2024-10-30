import type { ReviewerConfigAdminApiType, ReviewerConfigArgsType } from '@reviewpal/common/reviewerConfigs';
import { ReviewerConfigArgsTypeSchema } from '@reviewpal/common/reviewerConfigs';
import type { UseCrudFormExternalOptionsType } from '@reviewpal/web/ui';
import { useCrudForm, useReviewerConfigsAdminApi } from '@reviewpal/web/ui';
import { cloneDeep } from 'lodash';

export const useReviewerConfigForm = (options: UseCrudFormExternalOptionsType<ReviewerConfigAdminApiType>) => {
  const reviewerConfigsAdminApi = useReviewerConfigsAdminApi();

  return useCrudForm<ReviewerConfigAdminApiType, ReviewerConfigArgsType>({
    ...options,
    api: reviewerConfigsAdminApi,
    schema: ReviewerConfigArgsTypeSchema,
    getInitialValues: (target) => ({
      id: '',
      name: '',
      reviewer: '',
      config: {},
      integrations: [],
      ...cloneDeep(target),
    }),
  });
};
