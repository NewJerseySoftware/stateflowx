import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { reCaptchaV3 } from './recaptcha-v3.interface';

@Injectable()
export class HttpProvider {
  constructor() {}

  async verifyRecaptcha(responseToken: string): Promise<reCaptchaV3> {
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const payload = new URLSearchParams({
      response: responseToken,
      secret: process.env.GRECAPTCHA_KEY
    }).toString();
    console.log(payload);
    try {
      const response: AxiosResponse = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
