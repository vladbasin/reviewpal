import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import type { UserRoleType } from '@reviewpal/common/users';
import { RefreshTokenEntity } from './RefreshTokenEntity';
import { ResetPasswordTokenEntity } from './ResetPasswordTokenEntity';
import { InteractivePrUserAnalyticsEntity } from './InteractivePrUserAnalyticsEntity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id!: string;

  @Column({ type: 'varchar', unique: true })
  public email!: string;

  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'varchar', unique: true })
  public name!: string;

  @Column({ type: 'varchar', default: 'user' })
  public role!: UserRoleType;

  @DeleteDateColumn()
  public deletedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  public refreshTokenId?: string;
  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.user, { nullable: true, cascade: true })
  @JoinColumn()
  public refreshToken?: RefreshTokenEntity;

  @Column({ type: 'uuid', nullable: true })
  public resetPasswordTokenId?: string;
  @OneToOne(() => ResetPasswordTokenEntity, (resetPasswordToken) => resetPasswordToken.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  public resetPasswordToken?: ResetPasswordTokenEntity;

  @Column({ type: 'uuid', nullable: true })
  public interactivePrUserAnalyticsId?: string;
  @OneToOne(() => InteractivePrUserAnalyticsEntity, (interactivePrUserAnalytics) => interactivePrUserAnalytics.user, {
    nullable: true,
  })
  @JoinColumn()
  public interactivePrUserAnalytics?: InteractivePrUserAnalyticsEntity;

  public constructor(init: UserEntity) {
    Object.assign(this, init);
  }
}
