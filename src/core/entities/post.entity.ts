import { LinkEntity } from './link.entity';
import { ThumbnailEntity } from './thumbnail.entity';
import { AuthorEntity } from './author.entity';

export class PostEntity {
  id: string;
  published: string;
  updated: string;
  links: LinkEntity;
  thumbnails: ThumbnailEntity;
  categories: string[];
  title: string;
  content: string;
  author: AuthorEntity;
}
