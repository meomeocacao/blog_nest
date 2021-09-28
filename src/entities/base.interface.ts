/* eslint-disable prettier/prettier */
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false })
  isDelete: boolean;

  @BeforeInsert()
  generate() {
    this.id = uuid();
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updateAt = new Date();
  }
  // toJSON() {
  //   return {
  //     ...this,
  //     createAt: undefined,
  //     updateAt: undefined,
  //     isDelete: undefined,
  //     deleteAt: undefined,
  //     password: undefined,
  //   };
  // }
}
