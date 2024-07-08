import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { HttpProvider } from './shared/services/http/http-provider';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

const httpProvider: HttpProvider = new HttpProvider();

async function bootstrap() {

  const environment = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
  console.log('environment: ', environment);
  dotenv.config({ path: environment });

  const app = await NestFactory.create(AppModule);

// i don't think this is necessary because nginx is handling this
//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', req.header('Origin'));
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/verify/:responseToken', (req, res) => {
    const responseToken = req.params.responseToken;
    const token = responseToken.split('=');
    httpProvider.verifyRecaptcha(token[1]).then((data) => {
      res.send(data);
    });
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
}
bootstrap();
