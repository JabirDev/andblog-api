import { PostEntity } from './post.entity';

export class PostListEntity {
  items: PostEntity[];
  total: number;
  page: number;
  per_page: number;
}
