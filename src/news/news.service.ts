import { Injectable } from '@nestjs/common';
import { News } from './news.interface';

@Injectable()
export class NewsService {
  private readonly news: News[] = [];

  create(news: News): number {
    return this.news.push({
      id: String(this.news.length + 1),
      title: news.title,
      description: news.description,
      author: news.author,
      createdAt: new Date(),
      cover: news.cover,
    });
  }

  findAll(): News[] {
    return this.news;
  }

  findByIndex(index: string): News | null {
    console.assert(
      typeof this.news[+index - 1] !== 'undefined',
      '[findByIndex] Invalid',
    );

    if (typeof this.news[+index - 1] !== 'undefined') {
      return this.news[+index - 1];
    }
    return null;
  }

  edit(news: News): number {
    for (const i in this.news) {
      if (this.news[i].id === news.id) {
        this.news[i].title = news.title;
        this.news[i].description = news.description;
        this.news[i].author = news.author;
        return 1;
      }
    }
    return 0;
  }

  async remove(idNews: string): Promise<boolean> {
    const index = this.news.findIndex((obj) => obj.id === idNews);
    if (index !== -1) {
      this.news.splice(index, 1);
      return true;
    }
    return false;
  }
}
