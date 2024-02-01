import { Injectable, NotFoundException } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ErrorService } from '../error/error.service';
import { PostListEntity } from '@/core/entities/post-list.entity';
import { PostEntity } from '@/core/index';
import { PostQueryDto } from '@/shared/post-query.dto';

@Injectable()
export class FeedService {
  constructor(
    private readonly utils: UtilsService,
    private readonly errorService: ErrorService,
  ) {}

  async getPost(
    host: string,
    domain: string | number,
    query: Partial<PostQueryDto>,
  ): Promise<PostListEntity | void | unknown> {
    const isByUrl = typeof domain === 'string';
    const { label, page, per_page, q, path } = query;
    const currentPage = Number(page) ? Number(page) : 1;
    const perPage = Number(per_page) ? Number(per_page) : 10;
    const startIndex = currentPage > 1 ? (currentPage - 1) * perPage + 1 : 1;
    const options = `?start-index=${startIndex}&max-results=${perPage}${q ? '&q=' + q : ''}${path ? '&path=' + path : ''}`;
    const feedUrl = isByUrl
      ? `https://${domain}/feeds/posts/default${label ? '/-/' + label : ''}${options}`
      : `https://www.blogger.com/feeds/${domain}/posts/default${label ? '/-/' + label : ''}${options}`;

    try {
      const resFeed = await axios(feedUrl);
      // console.log('feed: ', resFeed.data);
      const $ = cheerio.load(resFeed.data);
      // return { mantap: 'kuy' };
      const totalPost = $('feed opensearch\\:totalResults').text().trim();
      const entryPosts = $('feed entry');
      if (entryPosts.length > 0) {
        const posts = [];
        entryPosts.map((index) => {
          posts.push(
            this.utils.extractPosts(host, $, $(entryPosts[index]), domain),
          );
        });
        return {
          items: posts,
          total: Number(totalPost),
          page: currentPage,
          per_page: perPage,
        };
      } else {
        return {
          error: true,
          message: 'No posts found',
        };
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return this.errorService.set({
          message: error.response?.data,
          statusCode: error.response?.status,
        });
      }
      return error;
    }
  }

  async getSinglePost(
    host: string,
    domain: number | string,
    path: string,
  ): Promise<PostEntity | void | unknown> {
    const isByUrl = typeof domain === 'string';
    const options = `?path=${path}`;
    const feedUrl = isByUrl
      ? `https://${domain}/feeds/posts/default${options}`
      : `https://www.blogger.com/feeds/${domain}/posts/default${options}`;

    console.log('url: ', feedUrl);
    try {
      const resFeed = await axios.get(feedUrl);
      const $ = cheerio.load(resFeed.data);
      const entryPosts = $('feed entry');
      if (!entryPosts) throw new NotFoundException('Post not found');
      const post = this.utils.extractPosts(host, $, entryPosts, domain);
      console.log('entry: ', entryPosts.length);
      return post;
    } catch (error: unknown) {
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
