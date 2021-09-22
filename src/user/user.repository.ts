/* eslint-disable prettier/prettier */
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  CreateUserDTO,
  UserFilterDTO,
} from './userDto/user.DTO';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUser(userFilterDto: UserFilterDTO): Promise<User[]> {
    const { firstname, lastname } = userFilterDto;

    const query = this.createQueryBuilder('user');

    if (firstname) {
      query.andWhere('user.firstname =:firstname', { firstname: firstname });
    }
    if(lastname){
        query.andWhere(
            'LOWER(user.lastname) LIKE LOWER(:lastname) OR LOWER(user.firstname) LIKE LOWER(:lastname', { lastname: `%${lastname}%` }
            );
    }
    const users = await query.getMany();
    return users;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const { username, email, password, firstname, lastname, profile } = createUserDto;
    const user = this.create({
      username,
      email,
      password,
      firstname,
      lastname,
      profile,
    });

    await this.save(user);
    return user;
  }
}
