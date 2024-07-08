import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor() {}
  send(tableID: string): void {}
}
