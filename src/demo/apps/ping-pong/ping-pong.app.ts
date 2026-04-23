import { StateflowApp } from '../../../core/app.interface';

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
      return { counter: ctx.state.counter };
    },
  },
};