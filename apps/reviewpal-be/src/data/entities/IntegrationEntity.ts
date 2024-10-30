import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import type { IntegrationSourceType } from '@reviewpal/common/integrations';
import { IntegrationsInReviewerConfigsEntity } from './IntegrationsInReviewerConfigsEntity';

@Entity({ name: 'integrations' })
export class IntegrationEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id!: string;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public source!: IntegrationSourceType;

  @Column({ type: 'varchar' })
  public provider!: string;

  @Column({ type: 'json' })
  public config!: object;

  @DeleteDateColumn()
  public deletedAt?: Date;

  @OneToMany(
    () => IntegrationsInReviewerConfigsEntity,
    (integrationsInReviewerConfigs) => integrationsInReviewerConfigs.integration,
    { cascade: true }
  )
  @JoinColumn({ name: 'integrationId' })
  public integrationsInReviewerConfigs?: IntegrationsInReviewerConfigsEntity[];

  public constructor(init: IntegrationEntity) {
    Object.assign(this, init);
  }
}
