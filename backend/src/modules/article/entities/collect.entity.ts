import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Article } from "./article.entity";
import { User } from "@/modules/user/entities/user.entity";

@Entity("article_collect")
@Unique(["userId", "articleId"])
export class ArticleCollect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  articleId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Article, (article) => article.id)
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}
