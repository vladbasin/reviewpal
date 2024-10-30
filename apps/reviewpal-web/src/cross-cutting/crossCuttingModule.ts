import { ContainerModule } from 'inversify';
import type { IEventAggregator } from '@reviewpal/common/cross-cutting';
import { EventAggregator, EventAggregatorSid } from '@reviewpal/common/cross-cutting';

export const crossCuttingModule = new ContainerModule((bind) => {
  bind<IEventAggregator>(EventAggregatorSid).to(EventAggregator).inSingletonScope();
});
