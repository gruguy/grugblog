import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from './category.entity'
import { Tag } from './tag.entity'

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'text', nullable: true })
  summary: string

  @Column({ nullable: true })
  cover: string

  @Column({ default: 0 })
  views: number

  @Column({ default: 0 })
  likes: number

  @ManyToOne(() => Category, (category) => category.articles)
  category: Category

  @Column()
  categoryId: number

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tag',
    joinColumn: {
      name: 'articleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

