import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { HttpProvider } from './shared/services/http/http-provider';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.prod' });

const httpProvider: HttpProvider = new HttpProvider();

async function bootstrap() {

  const environment = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
  //console.log('environment: ', environment);
  //dotenv.config({ path: environment });

  const app = await NestFactory.create(AppModule);

  // i don't think this is necessary because nginx is handling this
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', req.header('Origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.enableCors({
    origin: ['https://d1duhr610a9qxl.cloudfront.net', 'https://charmr.com', 'https://ws.charmr.com', 'http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/verify', async (req, res) => {
    const responseToken = req.query.responseToken as string;
    //console.log('Received token from frontend:', responseToken);

    try {
      const data = await httpProvider.verifyRecaptcha(responseToken);
      //console.log('Google reCAPTCHA response:', data);
      res.send(data);
    } catch (err) {
      //console.error('Error verifying reCAPTCHA:', err);
      res.status(500).send({ success: false, error: 'Server error' });
    }
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
}
bootstrap();
