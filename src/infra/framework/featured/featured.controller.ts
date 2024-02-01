import { AndblogRepository } from '@/infra/data/andblog.repository';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Featured')
@Controller(':domain')
export class FeaturedController {
  constructor(private readonly andblogRepository: AndblogRepository) {}

  @Get('featured')
  async getPost(
    @Req() req: Request,
    @Param('domain') domain: string,
    // @Query('id') id?: string,
  ) {
    // console.log('Featured post');
    const host = req.get('host');
    return await this.andblogRepository.getFeatured(host, domain);
  }
}
