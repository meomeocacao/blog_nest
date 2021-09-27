import { Comment } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FilterPostDTO, UpdatePostDTO } from './dtos/post.dto';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  //   get all post
  getAllPost(): Promise<PostEntity[]> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .andWhere('post.isDelete = false')
      .getMany();
  }

  // get all post  by user
  getAllPostByUser(userId: string): Promise<PostEntity[]> {
    return this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .andWhere('user.id = :id', { id: userId })
      .andWhere('post.isDelete = false')
      .getMany();
  }

  //   get post by Id
  getPostById(id: string): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .andWhere('post.isDelete = false')
      .andWhere('post.id =:id', { id })
      .getOne();
  }

  //   get post by user with post id
  getPostFromUser(user: User, id: string): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .andWhere('post.isDelete = false')
      .andWhere('post.id  =:id', { id })
      .leftJoin('post.user', 'user')
      .andWhere('user.id =:user', { user })
      .getOne();
  }

  // get post with filter
  getPostByFilter(postFilterDto: FilterPostDTO): Promise<PostEntity[]> {
    const query = this.createQueryBuilder('post').leftJoinAndSelect(
      'post.imgposts',
      'img',
    );
    const { tag, category } = postFilterDto;
    if (category)
      query
        .leftJoinAndSelect('post.categories', 'category')
        .andWhere('LOWER(category.title) = LOWER(:category)', {
          category,
        });
    if (tag)
      query
        .leftJoinAndSelect('post.tags', 'tag')
        .andWhere('LOWER(tag.title) = LOWER(:tag)', { tag });

    const posts = query.andWhere('post.isDelete = false').getMany();
    return posts;
  }
  // get post have comment
  getPostByCmt(cmtId: string): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('comment.id = :cmtId', { cmtId })
      .andWhere('comment.isDelete = false')
      .andWhere('isDelete = false')
      .getOne();
  }
  // update post by id
  updatePostById(postId: string, updatePostDto: UpdatePostDTO): Promise<any> {
    return this.createQueryBuilder()
      .update(PostEntity)
      .set({ title: updatePostDto.title, content: updatePostDto.content })
      .where('isDelete = false')
      .andWhere('id =:postId', { postId })
      .execute();
  }
  // delete all category from post
  deleteAllCategory(postId: string) {
    this.createQueryBuilder()
      .update(PostEntity)
      .set({ categories: [] })
      .where('id =:postId', { postId })
      .andWhere('isDelete = false')
      .execute();
  }
  // get post by postid and category
  getPostByIdWithCateId(
    cateId: string,
    postId: string,
  ): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .leftJoinAndSelect('post.categories', 'category')
      .where('category.id = :cateId', { cateId })
      .andWhere('id =:postId', { postId })
      .andWhere('post.isDelete = false')
      .getOne();
  }
  // get post by postid and tag
  getPostByIdWithTagId(
    tagId: string,
    postId: string,
  ): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .where('tag.id  =:tagId', { tagId })
      .andWhere('post.id =:postId', { postId })
      .andWhere('post.isDelete = false')
      .getOne();
  }
  // get post by post id and img id
  getPostByIdWithImgId(
    imgId: string,
    postId: string,
  ): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.imgposts', 'img')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.isDelete=false')
      .where('img.id=:imgId', { imgId })
      .andWhere('post.id =:postId', { postId })
      .andWhere('post.isDelete = false')
      .getOne();
  }
  // add comment to post
  addCommentToPost(post: PostEntity, comment: Comment) {
    post.comments.push(comment);
    this.save(post);
  }
}
