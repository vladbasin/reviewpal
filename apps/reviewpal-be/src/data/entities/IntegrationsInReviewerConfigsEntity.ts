import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IntegrationEntity } from './IntegrationEntity';
import { ReviewerConfigEntity } from './ReviewerConfigEntity';

@Entity({ name: 'integrations_in_reviewer_configs' })
export class IntegrationsInReviewerConfigsEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id!: number;

  @Column({ type: 'varchar' })
  public integrationId!: string;

  @Column({ type: 'varchar' })
  public reviewerConfigId!: string;

  @ManyToOne(() => IntegrationEntity, (integrationEntity) => integrationEntity.integrationsInReviewerConfigs, {
    orphanedRowAction: 'delete',
  })
  public integration?: IntegrationEntity;

  @ManyToOne(() => ReviewerConfigEntity, (integrationEntity) => integrationEntity.integrationsInReviewerConfigs, {
    orphanedRowAction: 'delete',
  })
  public reviewerConfig?: ReviewerConfigEntity;
}
