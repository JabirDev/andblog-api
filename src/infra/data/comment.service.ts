import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { ErrorService } from '../error/error.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CommentListEntity } from '@/core/entities/comment-list.entity';
import { QueryDto } from '@/shared/query.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly utils: UtilsService,
    private readonly errorService: ErrorService,
  ) {}

  async getCommentList(
    domain: string | number,
    postId: string,
    query: Partial<QueryDto>,
  ): Promise<CommentListEntity | void | unknown> {
    const isByUrl = typeof domain === 'string';
    const { page, per_page } = query;
    const currentPage = Number(page) ? Number(page) : 1;
    const perPage = Number(per_page) ? Number(per_page) : 10;
    const startIndex = currentPage > 1 ? (currentPage - 1) * perPage + 1 : 1;
    const options = `?start-index=${startIndex}&max-results=${perPage}`;
    const commentUrl = isByUrl
      ? `https://${domain}/feeds/${postId}/comments/default/${options}`
      : `https://www.blogger.com/feeds/${domain}${postId ? '/' + postId : ''}/comments/default/${options}`;

    try {
      const resComment = await axios.get(commentUrl);
      const $ = cheerio.load(resComment.data);
      const totalResults = $('feed opensearch\\:totalResults').text().trim();
      const entryComments = $('feed entry');
      const titleRaw = $('feed title');
      const titlePage = $(titleRaw[0]).text().trim();
      if (entryComments.length === 0) {
        return this.errorService.set({
          message: 'No comment yet',
          statusCode: 404,
        });
      }

      const comments = entryComments.toArray().map((entry) => {
        const $entry = $(entry);
        const idRaw = $entry.find('id').text().trim();
        const id = idRaw.substring(idRaw.indexOf('.post-') + 6);
        const published = this.utils.getRelativeTime(
          +new Date($entry.find('published').text().trim()),
        );
        const updated = this.utils.getRelativeTime(
          +new Date($entry.find('updated').text().trim()),
        );
        const content = $entry.find('content').text().trim();

        let link = '';
        let parentUrl = null;

        $entry.find('link').each((_, linkRaw) => {
          const rel = $(linkRaw).attr('rel');
          const href = $(linkRaw).attr('href');
          if (rel === 'alternate') link = href;
          if (rel === 'related') parentUrl = href;
        });

        const authorRaw = $entry.find('author');
        const authorName = authorRaw.find('name').text().trim();
        const authorImg = 'https:' + authorRaw.find('gd\\:image').attr('src');
        const author = { name: authorName, avatar: authorImg };

        return {
          id,
          published,
          updated,
          author,
          content,
          link,
          parent: parentUrl,
        };
      });

      const newComments = await Promise.all(
        comments.map(async (comment) => {
          let parent = null;

          if (comment.parent) {
            const resParent = await axios.get(comment.parent);
            const $$ = cheerio.load(resParent.data);
            const idRaw = $$('entry id').text().trim();
            const id = idRaw.substring(idRaw.indexOf('.post-') + 6);
            const content = $$('entry content').text().trim();
            const authorName = $$('entry author name').text().trim();
            const link = $$('entry link').eq(2).attr('href');
            parent = { id, content, authorName, link };
          }

          return { ...comment, parent };
        }),
      );

      const data = {
        title: titlePage,
        items: newComments,
        total: Number(totalResults),
        page: currentPage,
        per_page: perPage,
      };

      return data;
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
