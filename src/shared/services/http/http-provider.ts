import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpProvider {
  private apiKey = process.env.RECAPTCHA_API_KEY;
  private projectId = process.env.RECAPTCHA_PROJECT_ID;

  async verifyRecaptcha(responseToken: string): Promise<any> {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${this.projectId}/assessments?key=${this.apiKey}`;

    const payload = {
      event: {
        token: responseToken,
        siteKey: process.env.GRECAPTCHA_KEY,
        expectedAction: 'submit', // must match frontend
      },
    };

    try {
      const response = await axios.post(url, payload);
      return response.data;
    } catch (error) {
      const err = error as any;

console.error(
  'Error verifying reCAPTCHA Enterprise:',
  err.response?.data || err.message || 'Unknown error'
);
      throw new Error('reCAPTCHA verification failed');
    }
  }
}

