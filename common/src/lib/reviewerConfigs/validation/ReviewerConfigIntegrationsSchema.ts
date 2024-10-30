import { array, object } from 'yup';
import { IdSchema } from '@reviewpal/common/cross-cutting';
import type { IntegrationSourceType } from '@reviewpal/common/integrations';
import { IntegrationSourceSchema } from '@reviewpal/common/integrations';
import { reviewerConfigReviewersRegistry } from '@reviewpal/common/reviewerConfigs';
import type { Maybe } from '@vladbasin/ts-types';

export const ReviewerConfigIntegrationsSchema = array(
  object({ id: IdSchema, source: IntegrationSourceSchema }).required().label('Integration')
)
  .test(function (integrations) {
    const requiredIntegrations: Maybe<IntegrationSourceType[]> = reviewerConfigReviewersRegistry.get(
      this.from?.[0]?.value?.reviewer
    )?.requiredIntegrations;

    if (!requiredIntegrations) {
      return true;
    }

    const targetIntegrations = integrations ?? [];

    for (let i = 0; i < requiredIntegrations.length; i++) {
      if (targetIntegrations[i]?.source !== requiredIntegrations[i]) {
        return this.createError({
          path: `integrations[${i}]`,
          message: 'Required integration is missing',
        });
      }
    }
    return true;
  })
  .required()
  .label('Integrations');
