export interface reCaptchaV3 {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
}
