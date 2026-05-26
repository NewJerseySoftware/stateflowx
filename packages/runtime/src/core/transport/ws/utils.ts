import { IWebSocket } from './ws.interface.js';

export function isJsonString(event: string, ws: IWebSocket): boolean {
  try {
    JSON.parse(event.toString());
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    ws.send(JSON.stringify({ error: { message } }));
  }
  return true;
}
