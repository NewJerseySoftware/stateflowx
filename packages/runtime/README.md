# @stateflowx/runtime

StateFlowX Runtime is a lightweight orchestration runtime for building operational workflows, realtime systems, and AI-driven execution pipelines using pluggable transports and providers.

## Features

- JSON-RPC over WebSockets
- Runtime composition
- Pluggable provider architecture
- Transport abstraction
- Service orchestration foundation
- Realtime execution flow
- NestJS-based runtime infrastructure

## Installation

```bash
npm install @stateflowx/runtime
```

## Basic Example

```ts
import { createRuntime } from '@stateflowx/runtime';

const runtime = createRuntime({
  providers: [
    gemini({
      priority: 1,
    }),
  ],
});

```

## Current Status

StateFlowX Runtime is currently experimental and under active development.
