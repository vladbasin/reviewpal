import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@reviewpal/be/data';

@Entity({ name: 'reset_password_tokens' })
export class ResetPasswordTokenEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id!: string;

  @Column({ type: 'timestamp' })
  public createdAt!: Date;

  @Column({ type: 'uuid', unique: true })
  public userId!: string;

  @OneToOne(() => UserEntity, (user) => user.resetPasswordToken, { nullable: false })
  public user?: UserEntity;

  public constructor(init: ResetPasswordTokenEntity) {
    Object.assign(this, init);
  }
}
