import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { RedisModule } from "./common/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ArticleModule } from "./modules/article/article.module";
import { MusicModule } from "./modules/music/music.module";
import { ImageModule } from "./modules/image/image.module";
import { VideoModule } from "./modules/video/video.module";
import { ThemeModule } from "./modules/theme/theme.module";
import { SystemModule } from "./modules/system/system.module";
import { UploadModule } from "./modules/upload/upload.module";
import { CommentModule } from "./modules/comment/comment.module";
import { TestModule } from "./modules/test/test.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.production"],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    ArticleModule,
    MusicModule,
    ImageModule,
    VideoModule,
    ThemeModule,
    SystemModule,
    UploadModule,
    CommentModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
