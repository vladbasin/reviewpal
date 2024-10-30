import type { TlsOptions } from 'tls';
import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import type { IDataSourceProvider } from '@reviewpal/be/data';
import {
  InitialMigration1726869018000,
  IntegrationEntity,
  IntegrationsInReviewerConfigsEntity,
  RefreshTokenEntity,
  ResetPasswordTokenEntity,
  ReviewerConfigEntity,
  InteractivePrUserAnalyticsEntity,
  UserEntity,
} from '@reviewpal/be/data';
import type { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import { SecretsProviderSid } from '@reviewpal/be/_sids';
import type { ISecretsProvider } from '@reviewpal/be/cross-cutting';

const DatabasePublicCertEncoding = 'base64';

@injectable()
export class DataSourceProvider implements IDataSourceProvider {
  public constructor(@inject(SecretsProviderSid) private readonly _secretsProvider: ISecretsProvider) {}

  public initializeAsync(): Result<void> {
    const { DATABASE_URL, DATABASE_URL_SECRETS_MANAGER_KEY_ID, DATABASE_PUBLIC_CERT } = process.env;

    let sslConfig: Maybe<TlsOptions>;

    if (DATABASE_PUBLIC_CERT) {
      sslConfig = {
        rejectUnauthorized: true,
        ca: Buffer.from(DATABASE_PUBLIC_CERT, DatabasePublicCertEncoding),
      };
    }

    return this._secretsProvider
      .provideSecretAsync(DATABASE_URL_SECRETS_MANAGER_KEY_ID, DATABASE_URL)
      .onSuccess((url) => {
        this._dataSource = this._dataSource = new DataSource({
          type: 'postgres',
          url,
          ssl: sslConfig,
          logging: ['error', 'schema', 'migration'],
          synchronize: false,
          entities: [
            UserEntity,
            RefreshTokenEntity,
            ResetPasswordTokenEntity,
            IntegrationEntity,
            ReviewerConfigEntity,
            IntegrationsInReviewerConfigsEntity,
            InteractivePrUserAnalyticsEntity,
          ],
          migrations: [InitialMigration1726869018000],
          migrationsRun: true,
        });
      })
      .onSuccess(() => this._dataSource?.initialize()).void;
  }

  public provide(): DataSource {
    if (!this._dataSource) {
      throw new Error('DataSource is not initialized');
    }

    return this._dataSource;
  }

  private _dataSource: Maybe<DataSource>;
}
