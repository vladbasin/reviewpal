import type { IEventAggregator } from '@reviewpal/common/cross-cutting';
import { EventAggregatorSid } from '@reviewpal/common/cross-cutting';
import { useService } from '@reviewpal/web/ui';

export const useEventAggregator = () => useService<IEventAggregator>(EventAggregatorSid);
