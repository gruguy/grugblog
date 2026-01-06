console.log("ArticleModule - 文件被加载");
import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { Article } from "./entities/article.entity";
import { Category } from "./entities/category.entity";
import { Tag } from "./entities/tag.entity";
import { ArticleCollect } from "./entities/collect.entity";
import { ArticleLike } from "./entities/like.entity";
import { MusicModule } from "../music/music.module";
import { ImageModule } from "../image/image.module";
import { VideoModule } from "../video/video.module";

console.log("ArticleModule - 正在加载...");

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      Category,
      Tag,
      ArticleCollect,
      ArticleLike,
    ]),
    MusicModule,
    ImageModule,
    VideoModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule implements OnModuleInit {
  onModuleInit() {
    console.log("ArticleModule - 初始化完成！");
  }
}
