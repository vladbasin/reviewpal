import { Container } from 'inversify';
import type { Nullable } from '@vladbasin/ts-types';
import { uiModule } from '@reviewpal/web/ui';
import { crossCuttingModule } from '@reviewpal/web/cross-cutting';
import { dataModule } from '@reviewpal/web/data';

let instance: Nullable<Container> = null;

export const getContainer = (): Container => {
  if (!instance) {
    instance = new Container({ skipBaseClassChecks: true });

    instance.load(uiModule);
    instance.load(crossCuttingModule);
    instance.load(dataModule);
  }

  return instance;
};
