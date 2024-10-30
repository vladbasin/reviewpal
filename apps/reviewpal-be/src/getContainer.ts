import type { Nullable } from '@vladbasin/ts-types';
import { dataModule } from '@reviewpal/be/data';
import { businessModule } from '@reviewpal/be/business';
import { crossCuttingModule } from '@reviewpal/be/cross-cutting';
import { Container } from 'inversify';

let instance: Nullable<Container> = null;

export const getContainer = (): Container => {
  if (!instance) {
    instance = new Container({ skipBaseClassChecks: true });

    instance.load(crossCuttingModule);
    instance.load(businessModule);
    instance.load(dataModule);
  }

  return instance;
};
