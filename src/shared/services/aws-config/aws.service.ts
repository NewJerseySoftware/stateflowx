import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}j
  getConfig(): any {
    return {
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    };
  }
}
// AWS_REGION=us-east-1
// AWS_ACCESS_KEY_ID=REMOVED_AWS_KEY
// AWS_SECRET_ACCESS_KEY=REMOVED_AWS_SECRET
