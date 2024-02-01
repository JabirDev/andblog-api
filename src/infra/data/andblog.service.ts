import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { ErrorService } from '../error/error.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class AndblogService {
  constructor(
    private readonly utils: UtilsService,
    private readonly errorService: ErrorService,
  ) {}

  async getFeatured(host: string, domain: string) {
    try {
      const newUrl = 'https://' + domain;
      const rssUrl = `${newUrl}/feeds/posts/default?path=`;
      const resAndblog = await axios.get(newUrl);
      const $ = cheerio.load(resAndblog.data);
      const featuredRaw = $('#FeaturedPost1 article');
      const path = $(featuredRaw)
        .find('h3 a')
        .attr('href')
        .replace('https://' + domain, '');
      const urlPostReq = rssUrl + path;
      const resPost = await axios.get(urlPostReq);
      const $post = cheerio.load(resPost.data);
      const entry = $post('entry');
      const post = this.utils.extractPosts(host, $post, entry, domain);
      return post;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return this.errorService.set({
          message: error.response?.data,
          statusCode: error.response?.status,
        });
      }
      return error;
    }
  }
}
