/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn({unique:true})
    @IsNotEmpty()
    username: string;

    @PrimaryColumn({unique:true})
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    @Length(8,12)
    password: string;

    @Column()
    firstname: string;
    
    @Column()
    lastname: string;

    @Column()
    profile: string;

    @OneToMany(()=> Post, post => post.user)
    posts: Post[];

   
    toJSON(){
        return {...this, password : undefined,};
    }

}
