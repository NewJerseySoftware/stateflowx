# @stateflowx/runtime

StateFlowX Runtime is a lightweight orchestration runtime for building operational workflows, realtime systems, and AI-driven execution pipelines using pluggable transports and providers.

## Features

- JSON-RPC over WebSockets
- Runtime composition
- Pluggable provider architecture
- Transport abstraction
- Dynamic workflow registration
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
} from '@stateflowx/runtime';

import { WebSocketServer } from 'ws';

const server =
  new WebSocketServer({
    port: 3000,
  });

const transport =
  new WebSocketTransport(server);

const protocol =
  new JsonRpcProtocol();

const runtime =
  createRuntime({
    transport,

    protocol,

    providers: [
      {
        name: 'default',

        provider:
          new GeminiProvider(),
      },
    ],

    services: [],
  });

bootstrapRuntime(
  [
    new RuntimeInitializeApp(),
  ],
  runtime
);

console.log(
  'StateFlowX runtime listening on ws://localhost:3000'
);
```

---

## Architecture

```text
Client
  ->
HTTP / WebSocket
  ->
JSON-RPC
  ->
StateFlowX Runtime
  ->
Workflow Execution
  ->
Services
  ->
AI Providers
  ->
Structured Response
```

---

## Current Status

StateFlowX Runtime is currently experimental and under active development.
