import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) throw new BadRequestException('MongoId invalido');
    return value;
  }
}
