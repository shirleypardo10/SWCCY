import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const response = exception instanceof HttpException ? exception.getResponse() : null;
    const message =
      typeof response === 'object' && response && 'message' in response
        ? (response as { message: string | string[] }).message
        : exception instanceof Error
          ? exception.message
          : 'Error interno del servidor';
    res.status(status).json({ success: false, statusCode: status, message });
  }
}
