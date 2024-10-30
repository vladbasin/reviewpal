import { getContainer } from '@reviewpal/be/getContainer';
import type { IController } from '@reviewpal/be/api';
import type { ConstructorType } from '@reviewpal/common/cross-cutting';
import type { RequestHandler } from 'express';
import { Router } from 'express';

export const controllers = (...controllers: ConstructorType<IController>[]): RequestHandler => {
  const router = Router();
  const container = getContainer();

  controllers.forEach((controller) => {
    const instance = container.resolve(controller);
    instance.register(router);
  });

  return router;
};
