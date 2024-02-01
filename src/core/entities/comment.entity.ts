import { AuthorEntity } from './author.entity';

export class CommentEntity {
  id: string;
  published: string;
  updated: string;
  author: AuthorEntity;
  content: string;
  link: string;
  parent?: CommentParentEntity;
}

export class CommentParentEntity {
  id: string;
  content: string;
  authorName: string;
  link: string;
}
