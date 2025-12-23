import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity('video')
export class Video {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column()
  url: string

  @Column({ nullable: true })
  cover: string

  @Column({ type: 'int', nullable: true })
  duration: number

  @Column({ default: 0 })
  playCount: number

  @CreateDateColumn()
  createdAt: Date
}

