import { injectable } from 'inversify';
import { handleApiRequestAsync, type IController } from '@reviewpal/be/api';
import type { RequestHandler, Router } from 'express';
import { ApiRoutes } from '@reviewpal/common/api';
import { Result } from '@vladbasin/ts-result';

@injectable()
export class HealthCheckController implements IController {
  public register(router: Router): void {
    router.get(ApiRoutes.health, this.getHealth());
  }

  public getHealth(): RequestHandler {
    return handleApiRequestAsync({
      sendSuccessResponse: true,
      handler: () => Result.Void(),
    });
  }
}
