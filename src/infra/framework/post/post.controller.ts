import { PostRepository } from '@/infra/data/post.repository';
import { PostQueryDto } from '@/shared/post-query.dto';
import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Posts')
@Controller(':domain')
export class PostController {
  constructor(private readonly postRepository: PostRepository) {}

  @Get('post')
  async getPost(
    @Req() req: Request,
    @Param('domain') domain: string,
    @Query() query: PostQueryDto,
  ) {
    console.log('all post');
    const host = req.get('host');
    return await this.postRepository.getPost(host, domain, query);
  }

  @Get('post/:path')
  async getSinglePost(
    @Req() req: Request,
    @Param('domain') domain: string,
    @Param('path') path: string,
  ) {
    // console.log('single post');
    const host = req.get('host');
    return await this.postRepository.getOne(host, domain, path);
  }
}
