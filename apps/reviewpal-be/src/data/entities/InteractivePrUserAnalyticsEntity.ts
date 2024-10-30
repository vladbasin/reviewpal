import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity({ name: 'interactive_pr_user_analytics' })
export class InteractivePrUserAnalyticsEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id!: string;

  @Column({ type: 'integer', default: 0 })
  public reviews!: number;

  @Column({ type: 'integer', default: 0 })
  public codeSuggestions!: number;

  @Column({ type: 'integer', default: 0 })
  public publishedComments!: number;

  @Column({ type: 'integer', default: 0 })
  public discussions!: number;

  @Column({ type: 'integer', default: 0 })
  public inputTokens!: number;

  @Column({ type: 'integer', default: 0 })
  public outputTokens!: number;

  @Column({ type: 'uuid', unique: true })
  public userId!: string;

  @OneToOne(() => UserEntity, (user) => user.interactivePrUserAnalytics, { nullable: false, cascade: true })
  public user?: UserEntity;

  public constructor(init: UserEntity) {
    Object.assign(this, init);
  }
}
