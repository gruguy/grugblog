import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { Category } from '../../article/entities/category.entity'

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column()
  url: string

  @Column({ nullable: true })
  thumbnail: string

  @ManyToOne(() => Category, { nullable: true })
  category: Category

  @Column({ nullable: true })
  categoryId: number

  @CreateDateColumn()
  createdAt: Date
}

