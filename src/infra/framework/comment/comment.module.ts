import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentRepository } from '@/infra/data/comment.repository';
import { UtilsService } from '@/infra/utils/utils.service';
import { ErrorService } from '@/infra/error/error.service';
import { CommentService } from '@/infra/data/comment.service';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [
    CommentService,
    UtilsService,
    ErrorService,
    {
      provide: CommentRepository,
      useFactory: (commentService: CommentService) =>
        new CommentRepository(commentService),
      inject: [CommentService],
    },
  ],
})
export class CommentModule {}
