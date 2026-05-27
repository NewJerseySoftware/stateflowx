import { WebSocketServer }
  from 'ws';

import { EventDispatcher }
  from '../event-dispatcher.interface.js';

import { RuntimeEvent }
  from '../../runtime-event.js';

export class WebSocketEventDispatcher implements EventDispatcher {
  constructor(private server: WebSocketServer) { }

  async dispatch(event: RuntimeEvent): Promise<void> {
    const payload = JSON.stringify({
      type: 'runtime.event',

      payload: event,
    });

    this.server.clients.forEach((client) => {
      client.send(payload);
    });
  }
}
