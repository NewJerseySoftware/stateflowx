import { AES } from 'crypto-js';
import { enc } from 'crypto-js';
import * as encUtf8 from 'crypto-js/enc-utf8';

import * as fs from 'fs';
const configPath = './config.json';
const configData = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configData);

export function filterErrors(numErrors: any): Array<string> {
  //const numErrors = error.errors;
  const errorMessages = [];
  if (numErrors && Object.keys(numErrors).length > 0) {
    Object.keys(numErrors).forEach((key) => {
      errorMessages.push(numErrors[key].message);
    });
    // console.log(`Validation errors: ${errorMessages.join(', ')}`);
  }
  return errorMessages;
}

/* i just want to update what's in my data object */
export function filterData(existingData: any, newData: any): any {
  const filteredData: any = {};

  for (const key in existingData._doc) {
    if (newData[key] !== undefined) {
      filteredData[key] = newData[key];
    } else {
      filteredData[key] = existingData[key];
    }
  }

  for (const key in newData) {
    if (existingData[key] === undefined) {
      filteredData[key] = newData[key];
    }
  }

  return filteredData;
}

/* check if property name exists */
export function filterDataCheck(existingData: any, newData: any): any {
  const filteredData: any = {};
  for (const key in newData) {
    if (existingData[key] !== undefined && existingData[key] !== null) {
      if (existingData.schema.obj.hasOwnProperty(key)) {
        //name exists continue...
        return filterData(existingData, newData);
      } else {
        return null;
      }
    }
  }
}

/* takes array of keys to remove from obj */
// async function filterObjectByKey(obj: any, keysToRemove: any): Promise<any> {
//   if (typeof obj !== 'object' || obj === null) {
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     return Promise.all(obj.map((item) => filterObjectByKey(item, keysToRemove)));
//   }

//   const filteredObj = {};

//   for (let key in obj) {
//     if (keysToRemove.includes(key)) {
//       if (key === '_id') {
//         try {
//           filteredObj[key] = encryptString(obj[key].toString());
//         } catch (error) {
//           console.error('Error encrypting value:', error);
//         }
//       }
//       continue;
//     }

//     filteredObj[key] = await filterObjectByKey(obj[key], keysToRemove);
//   }

//   return filteredObj;
// }

// function encryptString(text: string) {
//   const key = config.SECRET_KEY;
//   const encrypted = AES.encrypt(text, key).toString();
//   return encrypted;
// }



// export function applyFilterOne(obj: any): any {
//   return filterObjectByKey(JSON.parse(JSON.stringify(obj)), [
//     '_id',
//     'startTime',
//     'updatedAt',
//     'createdAt',
//     '__v',
//   ]);
// }

export function handleServerErrors(info: string, error: any, id?: any): any {
  return { success: false, error: { message: info + error.message, id: id } };
}

// export function decryptString(encryptedText: string) {
//   const key = config.SECRET_KEY;
//   //const decrypted = AES.decrypt(encryptedText, key).toString(encUtf8);
//   const decrypted = AES.decrypt(encryptedText, key).toString(enc.Utf8);
//   return decrypted;
// }


