import { WebSocketServer } from 'ws';

import { RuntimeEvent } from '../../runtime-event-bus.js';

import { EventDispatcher } from '../event-dispatcher.interface.js';

export class WebSocketEventDispatcher implements EventDispatcher {
  constructor(private server: WebSocketServer) {}

  async dispatch(event: RuntimeEvent): Promise<void> {
    const payload = JSON.stringify({
      type: 'runtime.event',

      payload: event,
    });

    // console.log('[DISPATCHING EVENT]', this.server.clients.size);

    this.server.clients.forEach((client) => {
      client.send(payload);
    });
  }
}
