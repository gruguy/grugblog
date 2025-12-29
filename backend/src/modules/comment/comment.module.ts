import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { Comment } from "./entities/comment.entity";
import { ArticleModule } from "../article/article.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ArticleModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
