import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

// CommonJS 导入以避免类型签名问题
const helmet = require('helmet')
const compression = require('compression')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 安全防护
  app.use(helmet())

  // 压缩响应
  app.use(compression())

  // 全局前缀
  app.setGlobalPrefix('api')

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor())

  // CORS配置
  app.enableCors({
    origin: true,
    credentials: true,
  })

  // Swagger文档
  const config = new DocumentBuilder()
    .setTitle('个人博客API')
    .setDescription('个人博客的后端接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
  console.log(`Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()
