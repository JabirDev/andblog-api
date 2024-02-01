import { AndblogService } from './andblog.service';

export class AndblogRepository {
  constructor(private readonly andblogService: AndblogService) {}

  async getFeatured(host: string, domain: string) {
    return await this.andblogService.getFeatured(host, domain);
  }
}
