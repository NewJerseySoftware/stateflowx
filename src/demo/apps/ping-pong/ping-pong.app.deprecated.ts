/*
 * DEPRECATED
 *
 * Replaced by:
 * - RuntimeApp
 * - RuntimeContext
 * - runtime.prompt()
 *
 * Old action-map based application architecture.
 *
 * This implementation tightly coupled:
 * - actions
 * - transport registration
 * - application state
 *
 * The new runtime model treats apps as
 * orchestration modules with runtime
 * primitives instead of action registries.
 */

import { StateflowApp } from '../../../core/app.interface.deprecated';

export const PingPongApp: StateflowApp = {
  name: 'ping-pong',

  init(ctx) {
    ctx.state.counter = 0;
  },

  actions: {
    ping(ctx) {
      return {
        message: 'pong',
        counter: ctx.state.counter,
        time: Date.now(),
      };
    },

    increment(ctx) {
      ctx.state.counter++;

      return {
        counter: ctx.state.counter,
      };
    },
  },
};