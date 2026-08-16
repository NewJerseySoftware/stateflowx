import { AgentManager } from "../agent/agent-manager.js";

import { WebSocketEventDispatcher } from "../events/dispatchers/ws/websocket-event-dispatcher.js";

import { RuntimeEventBus } from "../events/runtime-event-bus.js";

import { ProviderManager } from "../provider/provider.manager.js";

import { ServiceManager } from "../service/service.manager.js";

import { InMemoryStore } from "../store/in-memory.db.js";

import { Store } from "../store/in-memory.store.js";

import { Transport } from "../transport/transport.interface.js";

import { ExecutionManager } from "./execution/execution-manager.js";

import { RuntimeEventDispatcher } from "./runtime-event-dispatcher.interface.js";

import { RuntimeOptions } from "./runtime-options.interface.js";


export class Runtime {

    private initialized = false;

    private started = false;

    readonly store?: Store;

    readonly transports: Transport[];

    readonly protocol;

    readonly events;

    readonly execution;

    readonly providers;

    readonly services;

    readonly agents;

    private readonly dispatchers: RuntimeEventDispatcher[] = [];

    constructor(options: RuntimeOptions) {

        this.store =
            options.store === false
                ? undefined
                : options.store ?? new InMemoryStore();

        this.transports = options.transports;

        this.protocol = options.protocol;

        this.events =
            options.events ?? new RuntimeEventBus();

        this.providers =
            new ProviderManager(options.providers ?? []);

        this.services =
            new ServiceManager(options.services ?? []);

        this.agents =
            new AgentManager(options.agents ?? []);

        this.execution =
            new ExecutionManager();

    }


    async initialize(): Promise<void> {

        if (this.initialized) {
            return;
        }

        for (const dispatcher of this.dispatchers) {

            this.events.on('*', async event => {
                await dispatcher.dispatch(event);
            });

        }

        this.initialized = true;
    }

    async start(): Promise<void> {

        if (!this.initialized) {
            throw new Error('Runtime has not been initialized.');
        }

        if (this.started) {
            return;
        }

        this.started = true;

    }

    addEventDispatcher(dispatcher: WebSocketEventDispatcher) {
        this.events?.on(
            '*',

            async (event) => {
                await dispatcher.dispatch(event);
            }
        );
    }

}