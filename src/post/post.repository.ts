import { PostEntity } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CommentDTO } from './postDto/comment.DTO';
import { CreatePostDTO } from './postDto/post.DTO';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  RELATIONS = ['imgposts', 'comments', 'categories', 'user', 'tags'];
  // async createPost(newPost: CreatePostDTO): Promise<PostEntity> {
  //   return await this.save(newPost);
  // }
  // get all post  user
  async getAllPostByUser(user: User): Promise<PostEntity[]> {
    return await this.find({
      where: { user: user, isDelete: false },
      //   relations: ['imgposts', 'comments', 'categories', 'user', 'tags'],
      relations: this.RELATIONS,
      withDeleted: true,
    });
  }
  //   get all post
  async getAllPost(): Promise<PostEntity[]> {
    return await this.find({ relations: this.RELATIONS });
  }
  //   get post by Id
  async getPostById(id: string): Promise<PostEntity> {
    return await this.findOne({
      relations: this.RELATIONS,
      where: { id: id, isDelete: false },
    });
  }
  //   get post by user with post id
  async getPostFromUser(user: User, id: string): Promise<PostEntity> {
    return await this.findOne({
      relations: this.RELATIONS,
      where: {
        user: user,
        id: id,
        isDelete: false,
      },
    });
  }
}
