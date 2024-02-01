import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  getRelativeTime(date: number, currentDate = new Date()): string {
    // in miliseconds
    const units: Record<string, number> = {
      year: 24 * 60 * 60 * 1000 * 365,
      month: (24 * 60 * 60 * 1000 * 365) / 12,
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000,
      second: 1000,
    };
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const elapsed = date - currentDate.getTime();

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const u in units)
      if (Math.abs(elapsed) > units[u] || u == 'second')
        return rtf.format(
          Math.round(elapsed / units[u]),
          u as Intl.RelativeTimeFormatUnit,
        );
    return '';
  }

  getThumbnail(url: string) {
    const thumbnailSize = 's1600';
    const patterns = [
      { search: 's72-w640-c-h362', replace: thumbnailSize },
      { search: 's72-w640-c-h360', replace: thumbnailSize },
      { search: 's72-w400-h225-c', replace: thumbnailSize },
      { search: 's72-c', replace: thumbnailSize },
    ];

    for (const pattern of patterns) {
      if (url.includes(pattern.search)) {
        return url.replace(pattern.search, pattern.replace);
      }
    }

    return url;
  }

  extractPosts(host: string, $: any, entryPosts: any, url: string | number) {
    const idRaw = entryPosts.find('id').text().trim();
    const id = idRaw.substring(idRaw.indexOf('.post-') + 6);
    const publishedRaw = entryPosts.find('published').text().trim();
    const published = this.getRelativeTime(+new Date(publishedRaw));
    const updatedRaw = entryPosts.find('updated').text().trim();
    const updated = this.getRelativeTime(+new Date(updatedRaw));
    const categoryRaw = entryPosts.find('category');
    const categories = [];
    if (categoryRaw.length > 0) {
      categoryRaw.map((c: string | number) => {
        const title = $(categoryRaw[c]).attr('term');
        categories.push(title);
      });
    }
    const linkRaw = entryPosts.find('link');
    const replies = `${host}/api/${url}/comments/${id}`;
    const links = {
      replies,
      self: $(linkRaw[4]).attr('href'),
    };
    const title = entryPosts.find('title').text().trim();
    const content = entryPosts.find('content').text().trim();
    const thumbnailSmall = entryPosts.find('media\\:thumbnail').attr('url');
    const thumbnails = thumbnailSmall
      ? {
          small: thumbnailSmall,
          large: this.getThumbnail(thumbnailSmall),
        }
      : null;
    const authorRaw = entryPosts.find('author');
    const authorName = authorRaw.find('name').text().trim();
    const authorImg = authorRaw.find('gd\\:image').attr('src');
    const author = { name: authorName, avatar: authorImg };
    const post = {
      id,
      published,
      updated,
      links,
      thumbnails,
      categories,
      title,
      content,
      author,
    };
    return post;
  }
}
