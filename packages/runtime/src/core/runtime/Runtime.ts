import { AgentManager } from "../agent/agent-manager.js";

import { RuntimeEventBus } from "../events/runtime-event-bus.js";

import { ProviderManager } from "../provider/provider.manager.js";

import { ServiceManager } from "../service/service.manager.js";

import { InMemoryDB } from "../storage/in-memory.db.js";

import { ExecutionManager } from "./execution/execution-manager.js";

import { RuntimeOptions } from "./runtime-options.interface.js";


export class Runtime {

    readonly apiKey;

    readonly db;

    readonly transport;

    readonly protocol;

    readonly events;

    readonly execution;

    readonly providers;

    readonly services;

    readonly agents;

    constructor(options: RuntimeOptions) {

        this.apiKey = options.apiKey;

        this.db = options.db ?? new InMemoryDB();

        this.transport = options.transport;

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

}