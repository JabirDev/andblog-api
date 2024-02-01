import { CommentListEntity } from '@/core/entities/comment-list.entity';
import { CommentService } from './comment.service';
import { QueryDto } from '@/shared/query.dto';

export class CommentRepository {
  constructor(private readonly commentService: CommentService) {}

  async getCommentList(
    domain: string | number,
    postId: string,
    query: Partial<QueryDto>,
  ): Promise<CommentListEntity | void | unknown> {
    return await this.commentService.getCommentList(domain, postId, query);
  }
}
