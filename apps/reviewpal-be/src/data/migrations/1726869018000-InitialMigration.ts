import { Table, type MigrationInterface, type QueryRunner } from 'typeorm';

export class InitialMigration1726869018000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'role', type: 'varchar', default: 'user' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'refreshTokenId', type: 'uuid', isNullable: true },
          { name: 'resetPasswordTokenId', type: 'uuid', isNullable: true },
          { name: 'interactivePrUserAnalyticsId', type: 'uuid', isNullable: true },
        ],
        indices: [
          { name: 'IDX_USER_NAME', columnNames: ['name'] },
          { name: 'IDX_USER_DELETED_AT', columnNames: ['deletedAt'] },
        ],
      }),
      true,
      true,
      true
    );

    await queryRunner.query('CREATE INDEX IDX_USER_EMAIL_TRGM ON users USING GIN (email gin_trgm_ops)');
    await queryRunner.query('CREATE INDEX IDX_USER_NAME_TRGM ON users USING GIN (name gin_trgm_ops)');

    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'createdAt', type: 'timestamp' },
          { name: 'userId', type: 'uuid', isNullable: false, isUnique: true },
        ],
        indices: [{ name: 'IDX_REFRESH_TOKEN_USER_ID', columnNames: ['userId'] }],
        foreignKeys: [
          {
            name: 'FK_REFRESH_TOKEN_USER',
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
      true,
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'reset_password_tokens',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'createdAt', type: 'timestamp' },
          { name: 'userId', type: 'uuid', isNullable: false, isUnique: true },
        ],
        indices: [{ name: 'IDX_RESET_PASSWORD_TOKEN_USER_ID', columnNames: ['userId'] }],
        foreignKeys: [
          {
            name: 'FK_RESET_PASSWORD_TOKEN_USER',
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
      true,
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'integrations',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'source', type: 'varchar' },
          { name: 'provider', type: 'varchar' },
          { name: 'config', type: 'json' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        indices: [
          { name: 'IDX_INTEGRATIONS_NAME', columnNames: ['name'] },
          { name: 'IDX_INTEGRATIONS_DELETED_AT', columnNames: ['deletedAt'] },
          { name: 'IDX_INTEGRATIONS_SOURCE', columnNames: ['source'] },
        ],
      }),
      true,
      true,
      true
    );

    await queryRunner.query('CREATE INDEX IDX_INTEGRATIONS_NAME_TRGM ON integrations USING GIN (name gin_trgm_ops)');

    await queryRunner.createTable(
      new Table({
        name: 'reviewer_configs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'reviewer', type: 'varchar' },
          { name: 'config', type: 'json' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        indices: [
          { name: 'IDX_REVIEWER_CONFIGS_NAME', columnNames: ['name'] },
          { name: 'IDX_REVIEWER_CONFIGS_DELETED_AT', columnNames: ['deletedAt'] },
        ],
        foreignKeys: [],
      }),
      true,
      true,
      true
    );

    await queryRunner.query(
      'CREATE INDEX IDX_REVIEWER_CONFIGS_NAME_TRGM ON reviewer_configs USING GIN (name gin_trgm_ops)'
    );

    await queryRunner.createTable(
      new Table({
        name: 'integrations_in_reviewer_configs',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true, isGenerated: true },
          {
            name: 'reviewerConfigId',
            type: 'uuid',
          },
          {
            name: 'integrationId',
            type: 'uuid',
          },
        ],
        indices: [
          { name: 'IDX_INTEGRATIONS_IN_REVIEWER_CONFIGS_REVIEWER_CONFIG_ID', columnNames: ['reviewerConfigId'] },
          { name: 'IDX_INTEGRATIONS_IN_REVIEWER_CONFIGS_INTEGRATION_ID', columnNames: ['integrationId'] },
        ],
        foreignKeys: [
          {
            columnNames: ['reviewerConfigId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'reviewer_configs',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['integrationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'integrations',
            onDelete: 'CASCADE',
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'interactive_pr_user_analytics',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'reviews', type: 'integer', default: 0 },
          { name: 'codeSuggestions', type: 'integer', default: 0 },
          { name: 'publishedComments', type: 'integer', default: 0 },
          { name: 'discussions', type: 'integer', default: 0 },
          { name: 'inputTokens', type: 'integer', default: 0 },
          { name: 'outputTokens', type: 'integer', default: 0 },
          { name: 'userId', type: 'uuid', isNullable: false, isUnique: true },
        ],
        indices: [
          { name: 'IDX_USER_ANALYTICS_USER_ID', columnNames: ['userId'] },
          { name: 'IDX_USER_ANALYTICS_REVIEWS', columnNames: ['reviews'] },
          { name: 'IDX_USER_ANALYTICS_CODE_SUGGESTIONS', columnNames: ['codeSuggestions'] },
          { name: 'IDX_USER_ANALYTICS_PUBLISHED_COMMENTS', columnNames: ['publishedComments'] },
          { name: 'IDX_USER_ANALYTICS_DISCUSSIONS', columnNames: ['discussions'] },
          { name: 'IDX_USER_ANALYTICS_INPUT_TOKENS', columnNames: ['inputTokens'] },
          { name: 'IDX_USER_ANALYTICS_OUTPUT_TOKENS', columnNames: ['outputTokens'] },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
      true,
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true, true, true);
    await queryRunner.dropTable('refresh_tokens', true, true, true);
    await queryRunner.dropTable('reset_password_tokens', true, true, true);
    await queryRunner.dropTable('integrations', true, true, true);
    await queryRunner.dropTable('reviewer_configs', true, true, true);
    await queryRunner.dropTable('integrations_in_reviewer_configs', true, true, true);
    await queryRunner.dropTable('interactive_pr_user_analytics', true, true, true);
  }
}
