import express, { json, urlencoded } from 'express';
import cors from 'cors';
import {
  AuthController,
  controllers,
  HealthCheckController,
  IntegrationsAdminController,
  InteractivePrAnalyticsAdminController,
  InteractivePrReviewersController,
  ReviewerConfigsAdminController,
  ReviewerConfigsController,
  UsersAdminController,
} from '@reviewpal/be/api';
import { logger } from '@reviewpal/be/cross-cutting';
import cookieParser from 'cookie-parser';

export const startApiServer = (): void => {
  const { API_HOST, API_PORT, CORS_ORIGIN } = process.env;

  const host = API_HOST ?? 'localhost';
  const port = API_PORT ? Number(API_PORT) : 3000;

  const app = express();

  if (CORS_ORIGIN) {
    app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
  }
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    controllers(
      AuthController,
      UsersAdminController,
      IntegrationsAdminController,
      ReviewerConfigsAdminController,
      InteractivePrReviewersController,
      ReviewerConfigsController,
      InteractivePrAnalyticsAdminController,
      HealthCheckController
    )
  );

  app.listen(port, host, () => {
    logger.info(`Server is running: http://${host}:${port}`);
  });
};
