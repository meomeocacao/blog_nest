/* eslint-disable prettier/prettier */
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @CreateDateColumn()
    createAt: Date;
    @UpdateDateColumn()
    updateAt: Date;

    @Column({default: false})
    isDelete: boolean;
    
    @DeleteDateColumn()
    deleteAt?:Date;

    @BeforeInsert()
    generate(){
        this.id = uuid();
    }
}
