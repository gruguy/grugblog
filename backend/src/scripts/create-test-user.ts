import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UserService } from "../modules/user/user.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userService = app.get(UserService);

  // 检查是否有用户存在
  const existingUser = await userService.findByUsername("admin");

  if (!existingUser) {
    // 创建测试用户
    const testUser = await userService.create({
      username: "admin",
      password: "123456",
      email: "admin@example.com",
      nickname: "管理员",
      bio: "系统管理员",
    });

    console.log("测试用户创建成功:", testUser);
  } else {
    console.log("测试用户已存在:", existingUser);
  }

  await app.close();
}

bootstrap();
