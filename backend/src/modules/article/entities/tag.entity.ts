import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm'
import { Article } from './article.entity'

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[]
}

