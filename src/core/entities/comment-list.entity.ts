import { CommentEntity } from './comment.entity';

export class CommentListEntity {
  title: string;
  items: CommentEntity[];
  total: number;
  page: number;
  per_page: number;
}
