import { getContainer } from '@reviewpal/web/getContainer';
import type { interfaces } from 'inversify';

export const useService = <TService>(sid: interfaces.ServiceIdentifier<TService>): TService => {
  return getContainer().get<TService>(sid);
};
