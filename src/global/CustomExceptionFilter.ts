import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';

interface QueryFailedError extends Error {
  code?: string;
  driverError?: {
    code: string;
  };
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    if (exception.driverError && exception.driverError.code === '23505') {
      const message = 'A duplicate entry error occurred.';
      throw new ApolloError(message, 'DUPLICATE_ENTRY');
    }

    return exception;
  }
}
