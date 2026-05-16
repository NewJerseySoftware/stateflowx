import { IWebSocket } from './ws.interface.js';

export function parseJsonRPCData(d: any): any {
  const dataObj = JSON.parse(JSON.stringify(d));
  return dataObj.data;
}

export function isJsonString(event: string, ws: IWebSocket): boolean {
  try {
    JSON.parse(event.toString());
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    ws.send(JSON.stringify({ error: { message } }));
  }
  return true;
}

interface icheck {
  jsonrpc: string;
  method: string;
  id: string | number;
  params: [];
  type?: string; //other
}
export function isValidJSONRPCRequest(obj: any) {
  let check: icheck;
  if (typeof obj === 'string') {
    try {
      check = JSON.parse(obj);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log('input error: ', message);
      return false;
    }
  } else if (typeof obj === 'object') {
    check = obj;
  } else {
    return false;
  }

  //my other input types:
  if (check && check.hasOwnProperty('type')) {
    return true;
  } else {
    //valid json-rpc
    if (
      check &&
      (typeof check !== 'object' || check === null || Array.isArray(check))
    ) {
      return false;
    }

    if (
      check &&
      (!check.hasOwnProperty('jsonrpc') || check.jsonrpc !== '2.0')
    ) {
      return false;
    }

    if (
      check &&
      (!check.hasOwnProperty('method') || typeof check.method !== 'string')
    ) {
      return false;
    }

    if (
      check &&
      (!check.hasOwnProperty('params') ||
        (typeof check.params !== 'undefined' &&
          !Array.isArray(check.params) &&
          typeof check.params !== 'object'))
    ) {
      return false;
    }

    if (
      check &&
      (!check.hasOwnProperty('id') ||
        (typeof check.id !== 'string' &&
          typeof check.id !== 'number' &&
          check.id !== null))
    ) {
      return false;
    }
  }

  return true;
}

export function applicationInputTypes(obj: any) {
  if (isValidJSONRPCRequest(obj)) {
    return true;
  }
  return false;
}
