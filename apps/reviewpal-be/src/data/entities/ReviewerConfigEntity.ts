import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { IntegrationsInReviewerConfigsEntity } from './IntegrationsInReviewerConfigsEntity';

@Entity({ name: 'reviewer_configs' })
export class ReviewerConfigEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id!: string;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public reviewer!: string;

  @Column({ type: 'json' })
  public config!: object;

  @DeleteDateColumn()
  public deletedAt?: Date;

  @OneToMany(
    () => IntegrationsInReviewerConfigsEntity,
    (integrationsInReviewerConfigs) => integrationsInReviewerConfigs.reviewerConfig,
    { cascade: true }
  )
  @JoinColumn({ name: 'reviewerConfigId' })
  public integrationsInReviewerConfigs?: IntegrationsInReviewerConfigsEntity[];

  public constructor(init: ReviewerConfigEntity) {
    Object.assign(this, init);
  }
}
