# StateFlowX

StateFlowX is a lightweight orchestration runtime for building operational workflows, realtime systems, and AI-driven execution pipelines using pluggable transports and providers.

## Current Status

StateFlowX is an experimental runtime currently focused on:
- runtime composition
- transport abstraction
- provider orchestration
- operational workflows
- realtime execution systems

The project is under active development and APIs may evolve.

## Features

- JSON-RPC over WebSockets
- Modular runtime architecture
- Pluggable provider system
- Realtime execution pipelines
- Transport abstraction
- Service orchestration foundation
- Angular-compatible client SDK

## Packages

- `@stateflowx/runtime`
- `@stateflowx/client`

## Example

```ts
const runtime = createRuntime({
  providers: [
    gemini(),
    mockProvider(),
  ],
});
```

## Inspiration

StateFlowX evolved from realtime multiplayer experiments, websocket orchestration problems, and operational workflow systems that became difficult to scale cleanly over time.

The framework gradually evolved into a reusable runtime architecture focused on transport abstraction, execution flow, and operational orchestration.

## Roadmap

- Provider failover/retries
- Workflow scheduling
- Additional transports (REST, others)
- Observability tooling
- Expanded orchestration/runtime capabilities