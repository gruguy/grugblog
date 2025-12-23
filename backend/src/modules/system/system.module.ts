import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemService } from './system.service'
import { SystemController } from './system.controller'
import { SystemConfig } from './entities/system-config.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}

