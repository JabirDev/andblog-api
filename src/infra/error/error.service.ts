import { ErrorEntity } from '@/core/entities/error.entity';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorService {
  set(error: ErrorEntity) {
    switch (error.statusCode) {
      case HttpStatus.BAD_REQUEST: {
        throw new BadRequestException(error);
      }
      case HttpStatus.NOT_FOUND: {
        throw new NotFoundException(error);
      }
      case HttpStatus.CONFLICT: {
        throw new ConflictException(error);
      }
      case HttpStatus.FORBIDDEN: {
        throw new ForbiddenException(error);
      }
      default: {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
