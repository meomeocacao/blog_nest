/* eslint-disable prettier/prettier */
import { User } from 'src/entities/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { UserFilterDTO } from './dtos/user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // filter user by query
  async getUserByFilter(userFilterDto: UserFilterDTO): Promise<User[]> {
    const { firstname, lastname } = userFilterDto;

    const query = this.createQueryBuilder('user');

    if (firstname) {
      query.andWhere('LOWER(user.firstname) =LOWER(:firstname)', {
        firstname: firstname,
      });
    }
    if (lastname) {
      query.andWhere('LOWER(user.lastname) = LOWER(:lastname) ', {
        lastname: lastname,
      });
    }
    const users = query.getMany();
    return users;
  }

  // get user by query string
  async getUserByQuery(queryString: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .where('post.isDelete = false')
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.username = :username', { username: queryString })
            .orWhere('user.email = :email', { email: queryString })
            .orWhere('user.id = :id', { id: queryString });
        }),
      )
      .getOne();
  }
  // check user by username/id/email
  async checkUserByQuery(queryString: string): Promise<User | undefined> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post', 'post.isDelete = false')
      .where('user.username = :username', { username: queryString })
      .orWhere('user.email = :email', { email: queryString })
      .orWhere('user.id = :id', { id: queryString })
      .getOne();
  }
  // check users by username/id/email
  async checkUsersByQuery(queryString: string): Promise<User[] | undefined> {
    return this.createQueryBuilder('user')
      .where('user.username = :username', { username: queryString })
      .orWhere('user.email = :email', { email: queryString })
      .orWhere('user.id = :id', { id: queryString })
      .getMany();
  }
  // get all user
  getAllUser(): Promise<User[]> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .where('post.isDelete = :false', { false: false })
      .getMany();
  }
}
