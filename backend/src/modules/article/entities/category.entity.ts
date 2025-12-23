import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { Article } from './article.entity'

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]
}

