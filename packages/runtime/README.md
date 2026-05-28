# @stateflowx/runtime

StateFlowX Runtime is a lightweight orchestration runtime for building operational workflows, realtime systems, and AI-driven execution pipelines using pluggable transports, providers, and realtime runtime events.

## Features

- JSON-RPC over WebSockets
- Runtime composition
- Runtime event streaming
- Workflow lifecycle events
- Realtime observability foundation
- Dynamic workflow registration
- Pluggable provider architecture
- Service orchestration foundation
- Realtime execution flow
- NestJS-based runtime infrastructure

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

- external npm package consumption
- WebSocket runtime hosting
- JSON-RPC transport
- dynamic runtime initialization
- workflow execution
- runtime event streaming
- Gemini provider integration
- remote workflow execution

---

## Basic Runtime Host Example

```ts
import 'dotenv/config';

import {
  createRuntime,
  bootstrapRuntime,
  RuntimeInitializeApp,
  GeminiProvider,
  JsonRpcProtocol,
  WebSocketTransport,
  WebSocketEventDispatcher,
} from '@stateflowx/runtime';

import { WebSocketServer } from 'ws';

const server = new WebSocketServer({
  port: 3001,
});

const transport = new WebSocketTransport(server);

const protocol = new JsonRpcProtocol();

const runtime = createRuntime({
  transport,

  protocol,

  providers: [
    {
      name: 'default',

      provider: new GeminiProvider(),
    },
  ],

  services: [],
});

//
// Realtime runtime event dispatcher
//
const dispatcher = new WebSocketEventDispatcher(server);

runtime.events.on(
  '*',

  async (event) => {
    await dispatcher.dispatch(event);
  }
);

bootstrapRuntime(
  [new RuntimeInitializeApp()],

  runtime
);

console.log('StateFlowX runtime listening on ws://localhost:3001');
```

---

## Architecture

```text
Client
  ->
WebSocket Transport
  ->
JSON-RPC Protocol
  ->
StateFlowX Runtime
  ->
Workflow Execution
  ->
Services / Providers
  ->
Runtime Events
  ->
Realtime Client Observability
```

---

## Runtime Event Flow

```text
workflow.started
  ->
service.execute
  ->
provider.generate
  ->
workflow.completed
  ->
realtime websocket event stream
```

---

## Current Transport Support

StateFlowX V1 currently standardizes on:

- JSON-RPC
- WebSocket transport
- realtime runtime event streaming

Additional transport and protocol adapters may be explored in future releases.

---

## Related Demos

- React Client Demo:
  <https://github.com/bws9000/react-stateflowx-demo>

---

## Current Status

StateFlowX Runtime is currently experimental and under active development.
