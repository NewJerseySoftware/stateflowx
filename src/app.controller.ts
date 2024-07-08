import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
//import { AwsConfigService } from './shared/services/aws-config/aws.service';
// import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import * as AWS from 'aws-sdk';∂ß

@Controller()
export class AppController {
  //documentClient: DocumentClient;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
  constructor(
    private readonly appService: AppService,
    //private readonly awsConfigService: AwsConfigService,
  ) {

    // const client = new DynamoDBClient(this.awsConfigService.getConfig());
    // const command = new ListTablesCommand({});

    // async function test(){
    //   try {
    //     const results = await client.send(command);
    //     console.log('FOUND TABLE: ' + results.TableNames.join("\n"));
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
    // test();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
