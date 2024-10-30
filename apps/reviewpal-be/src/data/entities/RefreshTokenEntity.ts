import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@reviewpal/be/data';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id!: string;

  @Column({ type: 'timestamp' })
  public createdAt!: Date;

  @Column({ type: 'uuid', unique: true })
  public userId!: string;

  @OneToOne(() => UserEntity, (user) => user.refreshToken, { nullable: false })
  public user?: UserEntity;

  public constructor(init: RefreshTokenEntity) {
    Object.assign(this, init);
  }
}
