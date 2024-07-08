import { Connection, createConnection } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from '@aws-sdk/client-secrets-manager';

// const devDBString: string = 'mongodb://localhost:27017/blackjack';
const devDBString: string = 'mongodb://localhost:27017';
const devEnv: boolean = true;

async function getAmazonSecret(): Promise<any> {
  // Use this code snippet in your app.
  // If you need more information about configurations or implementing the sample code, visit the AWS docs:
  // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

  return new Promise(async (resolve, reject) => {
    const secret_name = 'prod/mpbj/mongodburi';
    const client = new SecretsManagerClient({
      region: 'us-east-2',
    });
    let response: GetSecretValueCommandOutput;
    try {
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        }),
      );
      resolve(response.SecretString);
    } catch (error) {
      console.log('error',error);
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      reject(error);
      //throw error;
    }
    // return response.SecretString;
  });
}

export const databaseConnectionProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (configService: ConfigService): Promise<Connection> => {
    // if(devEnv){
    //   const connection: Connection = createConnection(
    //     devDBString,
    //     {
    //       dbName: 'blackjack',
    //     },
    //   );
    //   return connection;
    // }
    return getAmazonSecret().then((url) => {
      const connectionString = url;
      const connection: Connection = createConnection(
        JSON.parse(connectionString).MONGODB_URI,
        {
          dbName: 'blackjack',
        },
      );
      return connection;
    });
  },
  inject: [ConfigService],
};
