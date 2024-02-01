import { Module } from '@nestjs/common';
import { FeaturedController } from './featured.controller';
import { UtilsService } from '@/infra/utils/utils.service';
import { ErrorService } from '@/infra/error/error.service';
import { AndblogService } from '@/infra/data/andblog.service';
import { AndblogRepository } from '@/infra/data/andblog.repository';

@Module({
  imports: [],
  controllers: [FeaturedController],
  providers: [
    AndblogService,
    UtilsService,
    ErrorService,
    {
      provide: AndblogRepository,
      useFactory: (andblogService: AndblogService) =>
        new AndblogRepository(andblogService),
      inject: [AndblogService],
    },
  ],
})
export class FeaturedModule {}
