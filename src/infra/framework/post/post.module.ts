import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from '@/infra/data/post.repository';
import { FeedService } from '@/infra/data/feed.service';
import { UtilsService } from '@/infra/utils/utils.service';
import { ErrorService } from '@/infra/error/error.service';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [
    FeedService,
    UtilsService,
    ErrorService,
    {
      provide: PostRepository,
      useFactory: (feedService: FeedService) => new PostRepository(feedService),
      inject: [FeedService],
    },
  ],
})
export class PostModule {}
