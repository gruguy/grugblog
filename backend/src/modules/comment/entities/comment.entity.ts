import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Article } from "@/modules/article/entities/article.entity";
import { User } from "@/modules/user/entities/user.entity";

@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column()
  articleId: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  parentId: number | null;

  // 暂时注释掉avatar字段，因为数据库中没有这个字段
  // @Column({ nullable: true })
  // avatar: string;

  @ManyToOne(() => Article, { nullable: true })
  @JoinColumn({ name: "articleId" })
  article: Article | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: User | null;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 暂时注释掉这两个字段，因为数据库中没有这些字段
  // @Column({ default: 0 })
  // likes: number;

  // @Column({ default: false })
  // liked: boolean;
}
