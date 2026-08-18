import {
  StoreAction,
} from '@stateflowx/common';

import {
  RuntimeContext,
} from '../../../runtime/runtime-context.interface.js';

export class StoreActionExecutor {
  constructor(
    private readonly runtime: RuntimeContext
  ) { }

  async execute(
    action: StoreAction,
    results: Map<string, unknown>
  ): Promise<unknown> {
    const store = this.runtime.store;

    if (!store) {
      throw new Error(
        `Store action "${action.id}" cannot execute because storage is disabled`
      );
    }

    if (
      action.store &&
      store.type !== action.store
    ) {
      throw new Error(
        `Store action "${action.id}" requires "${action.store}", but the active store is "${store.type}"`
      );
    }

    switch (action.operation) {
      case 'get': {
        const key =
          this.requireKey(action);

        return store.get(key);
      }

      case 'set': {
        const key =
          this.requireKey(action);

        const connectors =
          action.inputConnectors ?? [];

        if (connectors.length !== 1) {
          throw new Error(
            `Store set action "${action.id}" requires exactly one input connector`
          );
        }

        const sourceActionId =
          connectors[0].actionId;

        if (!results.has(sourceActionId)) {
          throw new Error(
            `Input not available: ${sourceActionId}`
          );
        }

        const value =
          results.get(sourceActionId);

        await store.set(
          key,
          value
        );

        return value;
      }

      case 'delete': {
        const key =
          this.requireKey(action);

        await store.delete(key);

        return {
          deleted: true,
          key,
        };
      }

      case 'clear': {
        await store.clear();

        return {
          cleared: true,
        };
      }
    }
  }

  private requireKey(
    action: StoreAction
  ): string {
    if (!action.key) {
      throw new Error(
        `Store action "${action.id}" requires a key`
      );
    }

    return action.key;
  }
}