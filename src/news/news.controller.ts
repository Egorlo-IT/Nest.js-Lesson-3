import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Res,
  HttpStatus,
  HttpException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { News } from './news.interface';
import { NewsService } from './news.service';
import { htmlTemplate } from '../views/template';
import { newsTemplate } from '../views/newsTemplate';
import { newsTemplateDetail } from '../views/newsTemplateDetail';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsCreateDto } from './dtos/news-create.dto';
import { NewsEditDto } from './dtos/news-edit.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { imageFileFilter } from 'src/utils/imageFileFilter';

const PATH_NEWS = '/news-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private readonly commentService: CommentsService,
  ) {}

  @Get('all')
  async getNews(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  async getById(@Param() params: NewsIdDto): Promise<News | undefined> {
    return this.newsService.findByIndex(params.id);
  }

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFiles() cover: Express.Multer.File,
  ) {
    let coverPath;
    if (cover[0]?.filename?.length > 0) {
      coverPath = PATH_NEWS + cover[0].filename;
    }
    try {
      return this.newsService.create({
        ...news,
        cover: coverPath,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('edit')
  async edit(@Body() news: NewsEditDto, @Res() response: Response) {
    if (this.newsService.edit(news) !== 0) {
      return response
        .status(200)
        .send(
          `Новость с идентификатором id: ${news.id} успешно отредактирована`,
        );
    } else {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Новость с идентификатором id: ${news.id} не найдена!`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param() params: NewsIdDto): Promise<boolean> {
    return (
      this.newsService.remove(params.id) &&
      this.commentService.removeAll(params.id)
    );
  }

  @Get()
  async getViewAll(): Promise<string> {
    const news = this.newsService.findAll();
    return htmlTemplate(newsTemplate(news));
  }

  @Get(':id/detail')
  async getByIdDetail(@Param() params: NewsIdDto): Promise<string> | null {
    const newsDetail = this.newsService.findByIndex(params.id);
    const comments = await this.commentService.findAll(params.id);
    return htmlTemplate(newsTemplateDetail(newsDetail, comments));
  }
}
