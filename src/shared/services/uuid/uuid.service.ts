import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UUIDService {
  getUniqueV4ID(): string {
    return uuidv4();
  }
}