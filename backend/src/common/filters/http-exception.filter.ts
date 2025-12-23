import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // 输出完整的错误信息到控制台
    console.error('完整错误信息:', exception)

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : '服务器内部错误'

    response.status(status).json({
      code: status,
      message: typeof message === 'string' ? message : (message as any).message,
      data: null,
      timestamp: new Date().toISOString(),
    })
  }
}

