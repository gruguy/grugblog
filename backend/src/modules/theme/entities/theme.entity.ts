import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('theme')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  primaryColor: string

  @Column()
  secondaryColor: string

  @Column({ nullable: true })
  switchTime: string

  @Column({ default: false })
  isEnabled: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

