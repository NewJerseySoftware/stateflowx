# @stateflowx/client

StateFlowX Client is a lightweight client SDK for communicating with StateFlowX runtimes over realtime transports such as JSON-RPC over WebSockets.

## Features

- JSON-RPC client support
- WebSocket transport integration
- Realtime communication
- Lightweight runtime connectivity
- Angular-compatible architecture
- Transport-oriented design

## Installation

```bash
npm install @stateflowx/client
```

## Basic Example

```ts
import { createClient } from '@stateflowx/client';

const client = createClient({
  url: 'ws://localhost:3000',
});

await client.connect();
```

## Purpose

The client package is designed to communicate with StateFlowX runtimes while remaining transport-oriented and lightweight. The architecture is intended to support future transport layers and operational workflow integrations beyond the current JSON-RPC/WebSocket implementation.

## Current Status

StateFlowX Client is currently experimental and under active development.

Current areas of focus include:

- Realtime runtime connectivity
- JSON-RPC transport communication
- Runtime interaction patterns
- Transport abstraction

## Roadmap

- Additional transport support
- REST-based transport experimentation
- Improved client lifecycle handling
- Expanded runtime communication patterns
- Observability and debugging tooling
