import { FeedService } from './feed.service';
import { PostQueryDto } from '@/shared/post-query.dto';

export class PostRepository {
  constructor(private readonly feedService: FeedService) {}

  async getPost(
    host: string,
    domain: string | number,
    filter: Partial<PostQueryDto>,
  ) {
    return await this.feedService.getPost(host, domain, filter);
  }

  async getOne(host: string, domain: number | string, path: string) {
    return await this.feedService.getSinglePost(host, domain, path);
  }
}
