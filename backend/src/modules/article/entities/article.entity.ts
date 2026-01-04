import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Category } from "./category.entity";
import { Tag } from "./tag.entity";
import { Comment } from "../../comment/entities/comment.entity";

@Entity("article")
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  collects: number;

  @Column({ default: "draft" })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "authorId" })
  author: User;

  @Column()
  authorId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: "article_tag",
    joinColumn: { name: "articleId" },
    inverseJoinColumn: { name: "tagId" },
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
