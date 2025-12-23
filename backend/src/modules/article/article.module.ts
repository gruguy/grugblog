import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { Article } from './entities/article.entity'
import { Category } from './entities/category.entity'
import { Tag } from './entities/tag.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}

