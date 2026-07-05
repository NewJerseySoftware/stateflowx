# @stateflowx/runtime

StateFlowX Runtime is a lightweight orchestration runtime for building AI-powered workflows using pluggable protocols, transports, providers, and services.

## Features

- JSON-RPC protocol support
- HTTP transport
- WebSocket transport
- Multi-transport runtime architecture
- Runtime composition
- Runtime lifecycle management
- Runtime event streaming
- Workflow lifecycle events
- Dynamic workflow registration
- Pluggable provider architecture
- Service orchestration
- Realtime observability foundation

---

## Installation

```bash
npm install @stateflowx/runtime
```

---

## Runtime Host Example

Minimal external runtime host example:

<https://github.com/bws9000/stateflowx-runtime-host-example>

This demonstrates:

- External npm package consumption
- HTTP JSON-RPC hosting
- WebSocket JSON-RPC hosting
- Multi-transport runtime configuration
- Dynamic runtime initialization
- Runtime lifecycle management
- Workflow execution
- Runtime event streaming
- Gemini provider integration

---

## Basic Runtime Host Example

```ts
import 'dotenv/config';

import {
  bootstrapHttpRuntime,
  RuntimeInitializeApp,
  GeminiProvider,
  WebSocketTransport,
  WebSocketEventDispatcher,
} from '@stateflowx/runtime';

import { WebSocketServer } from 'ws';

const {
  runtime,
} = await bootstrapHttpRuntime({

  providers: [
    {
      name: 'gemini',

      provider: new GeminiProvider(),
    },
  ],

  services: [],

  apps: [
    new RuntimeInitializeApp(),
  ],
});

const server = new WebSocketServer({
  port: 3001,
});

const websocket =
  new WebSocketTransport(server);

runtime.transports.push(websocket);

runtime.addEventDispatcher(
  new WebSocketEventDispatcher(server)
);

console.log(`
HTTP JSON-RPC:
http://localhost:3000/rpc

WebSocket JSON-RPC:
ws://localhost:3001
`);
```


---

## Runtime Event Flow

```text
workflow.started
        │
service.execute
        │
provider.generate
        │
workflow.completed
        │
WebSocket runtime event stream
```

---

## Current Transport Support

StateFlowX Runtime currently supports:

- JSON-RPC protocol
- HTTP transport
- WebSocket transport
- Realtime runtime events over WebSockets

---

## Roadmap

- Additional protocol support
- Runtime observability tooling
- Execution tracing
- Expanded workflow orchestration
- Provider fallback strategies
- Service execution events
- Provider execution events
- Streaming execution support

---

## Related Demos

- React Client Demo  
  <https://github.com/bws9000/react-stateflowx-demo>

- Angular Client Demo  
  <https://github.com/bws9000/stateflowx-client-demo>

---

## Current Status

StateFlowX Runtime is experimental and under active development.
