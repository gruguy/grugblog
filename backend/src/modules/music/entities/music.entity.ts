import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity('music')
export class Music {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  artist: string

  @Column()
  cover: string

  @Column()
  url: string

  @Column({ type: 'int', nullable: true })
  duration: number

  @Column({ default: 0 })
  playCount: number

  @CreateDateColumn()
  createdAt: Date
}

