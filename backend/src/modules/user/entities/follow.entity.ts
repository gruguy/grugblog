import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('user_follow')
export class UserFollow {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  followingId: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: User
}
