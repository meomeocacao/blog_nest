import { jwtConstants } from 'src/auth/strategies/constants';
import { User } from 'src/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @OneToOne(() => User, (user) => user.refreshToken, { cascade: true })
  user: User;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  expires: Date;

  @BeforeInsert()
  generate() {
    this.id = uuid();
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 20);
    this.expires = expiration;
  }
}
