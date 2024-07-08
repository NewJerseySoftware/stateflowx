import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';
import { AES } from 'crypto-js';
import { enc } from 'crypto-js';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class EncryptionService {
  constructor(private configService: AppConfigService) {}

  encryptString(text: string) {
    // if (text && this.isValidBase64(text)) {
    //   return text;
    // }
    try {
      const key = this.configService.getConfig().SECRET_KEY;
      const encrypted = AES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      console.log('encryption error: ' + error);
    }
  }

  async encryptStringAsync(text: string) {
    if (!isValidObjectId(text)) {
      return text;
    }
    try {
      const key = await this.configService.getConfig().SECRET_KEY;
      const encrypted = AES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      console.log('encryption error: ' + error);
    }
  }

  decryptString(encryptedText: string) {
    // if (encryptedText && !this.isValidBase64(encryptedText)) {
    //   return encryptedText;
    // }

    try {
      const key = this.configService.getConfig().SECRET_KEY;
      // console.log('Encrypted Text:', encryptedText);
      // console.log('Decryption Key:', key);
      const decrypted = AES.decrypt(encryptedText, key);
      const decryptedText = decrypted.toString(enc.Utf8);
      return decryptedText;
    } catch (error) {
      console.log('dencryption error: ' + error);
    }
  }

  async decryptStringAsync(encryptedText: string) {
    if (isValidObjectId(encryptedText)) {
      return encryptedText;
    }
    try {
      const key = await this.configService.getConfig().SECRET_KEY;
      const decrypted = AES.decrypt(encryptedText, key);
      const decryptedText = decrypted.toString(enc.Utf8);
      return decryptedText;
    } catch (error) {
      console.log('dencryption error: ' + error);
    }
  }

  // isMongoIdOrHash(value:string) {
  //   try {
  //     new ObjectId(value);
  //     return true; // Successfully created ObjectId, so it's a MongoDB _id
  //   } catch (error) {
  //     return false; // Failed to create ObjectId, so it's not a MongoDB _id
  //   }
  // }

  async filterObjectByKey(obj: any, keysToRemove: any): Promise<any> {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return Promise.all(
        obj.map((item) => this.filterObjectByKey(item, keysToRemove)),
      );
    }

    const filteredObj = {};

    for (let key in obj) {
      if (keysToRemove.includes(key)) {
        if (key === '_id') {
          try {
            filteredObj[key] = this.encryptString(obj[key].toString());
          } catch (error) {
            console.error('Error encrypting value:', error);
          }
        }
        if (key === 'gameID') {
          try {
            filteredObj[key] = this.encryptString(obj[key].toString());
          } catch (error) {
            console.error('Error encrypting value:', error);
          }
        }
        continue;
      }

      filteredObj[key] = await this.filterObjectByKey(obj[key], keysToRemove);
    }

    return filteredObj;
  }

  // isValidBase64(str: string) {
  //   const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  //   return base64Regex.test(str);
  // }

  // Function to check if a string is a valid Base64 encoded string
  // isValidBase64(str: string) {
  //   try {
  //     return btoa(atob(str)) === str;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  applyFilterOne(obj: any): any {
    return this.filterObjectByKey(JSON.parse(JSON.stringify(obj)), [
      '_id',
      'gameID',
      'updatedAt',
      'createdAt',
      '__v',
    ]);
  }
}
