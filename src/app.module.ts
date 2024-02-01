import { Module } from '@nestjs/common';
import { PostModule } from './infra/framework';
import { CommentModule } from './infra/framework/comment/comment.module';
import { FeaturedModule } from './infra/framework/featured/featured.module';

@Module({
  imports: [FeaturedModule, PostModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
