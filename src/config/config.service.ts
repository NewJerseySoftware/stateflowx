import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppConfigService {
  private readonly config: any;

  constructor() {
    const configPath = './config.json';
    const configData = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(configData);
  }

  // getBroadcastEvents() {
  //   return this.config.BROADCAST_EVENTS;
  // }
  getConfig(){
    return this.config;
  }
}

