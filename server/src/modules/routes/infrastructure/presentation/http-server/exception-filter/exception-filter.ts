import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { RouteApplicationError } from 'src/modules/routes/core/domain/exceptions/ApplicationException';

@Catch(RouteApplicationError)
export class ProductCreatorFilter implements ExceptionFilter {
  catch(exception: RouteApplicationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Logger.error(
      `ProductController (${request.method}) at {${request.path}} error: ${exception.message}`,
    );

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message: exception.message,
    });
  }
}
