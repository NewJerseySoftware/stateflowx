# @stateflowx/common

Shared contracts and type definitions used throughout the StateFlowX ecosystem.

This package contains common interfaces, events, envelopes, and execution models shared between:

- `@stateflowx/runtime`
- `@stateflowx/client`

## Installation

```bash
npm install @stateflowx/common
```

## Included Contracts

Examples include:

- `RuntimeEvent`
- `RuntimeEnvelope`
- `ExecutionContext`

## Usage

```typescript
import {
  RuntimeEvent,
  RuntimeEnvelope,
  ExecutionContext,
} from '@stateflowx/common';
```

Most application developers will not need to install this package directly. It is primarily intended for StateFlowX package development and shared contract definitions.
