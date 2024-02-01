import { CommentRepository } from '@/infra/data/comment.repository';
import { QueryDto } from '@/shared/query.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller(':domain')
export class CommentController {
  constructor(private readonly commentRepository: CommentRepository) {}

  @Get('comments/:postId')
  async getPost(
    @Param('domain') domain: string,
    @Param('postId') postId: string,
    @Query() query: QueryDto,
  ) {
    // console.log('Comments post');
    return await this.commentRepository.getCommentList(domain, postId, query);
  }
}
