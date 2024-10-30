import type { InteractivePrReviewerConfigType } from '@reviewpal/common/reviewerConfigs';
import {
  InteractivePrReviewerConfigDefault,
  InteractivePrReviewerConfigTypeSchema,
  InteractivePrReviewerName,
} from '@reviewpal/common/reviewerConfigs';
import type { ObjectRegistryEntryType } from '@reviewpal/common/cross-cutting';
import { ObjectRegistry } from '@reviewpal/common/cross-cutting';
import type { AnyObject } from 'yup';
import type { IntegrationSourceType } from '@reviewpal/common/integrations';

type EntryType<TValue extends AnyObject = AnyObject> = ObjectRegistryEntryType<TValue> & {
  requiredIntegrations?: IntegrationSourceType[];
};

export const reviewerConfigReviewersRegistry = new ObjectRegistry<EntryType>().add<
  InteractivePrReviewerConfigType,
  EntryType<InteractivePrReviewerConfigType>
>(InteractivePrReviewerName, {
  schema: InteractivePrReviewerConfigTypeSchema,
  defaultValue: InteractivePrReviewerConfigDefault,
  requiredIntegrations: ['llm', 'vcs'],
});
