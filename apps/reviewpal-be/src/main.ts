import 'pg';
import 'reflect-metadata';
import { startApiServer } from '@reviewpal/be/api';
import { CrypterSid, DataSourceProviderSid, PasswordAuthorizerSid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import { logger } from '@reviewpal/be/cross-cutting';
import dotenv from 'dotenv';
import { Result } from '@vladbasin/ts-result';
import type { IInitializable } from '@reviewpal/common/cross-cutting';
import { getContainer } from './getContainer';

const initialize = (): void => {
  dotenv.config();

  const sidsToInit = [DataSourceProviderSid, TokenAuthorizerSid, PasswordAuthorizerSid, CrypterSid];

  Result.CombineFactories(
    sidsToInit.map((sid) => (): Result<void> => getContainer().get<IInitializable>(sid).initializeAsync()),
    { concurrency: 1 }
  )
    .onSuccess(() => startApiServer())
    .onFailureWithError((error) => logger.error('Failed to initialize', error));
};

initialize();
