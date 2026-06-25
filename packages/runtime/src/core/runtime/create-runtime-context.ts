import { RuntimeContext } from "./runtime-context.interface.js";

import { Runtime } from "./Runtime.js";

export function createRuntimeContext(
    runtime: Runtime
): RuntimeContext {

    return {

        apiKey: runtime.apiKey,

        db: runtime.db,

        state: {},

        protocol: runtime.protocol,

        agents: runtime.agents,

        providers: runtime.providers,

        services: runtime.services,

        events: runtime.events,

        execution: runtime.execution,

        prompt(route, handler) {

            runtime.protocol.addMethod(
                route,
                handler
            );

        }

    };

}
// import { InMemoryDB } from '../storage/in-memory.db.js';

// import { RuntimeContext } from './runtime-context.interface.js';

// import { RuntimeApp } from './runtime-app.interface.js';

// import { RuntimeOptions } from './runtime-options.interface.js';

// import { ServiceManager } from '../service/service.manager.js';

// import { ProviderManager } from '../provider/provider.manager.js';

// import { ExecutionManager } from './execution/execution-manager.js';

// import { AgentManager } from '../agent/agent-manager.js';
// import { Runtime } from './Runtime.js';

// export function createRuntimeContext(
//   runtime:Runtime
// ): RuntimeContext {
//   // const db = config.db ? config.db : new InMemoryDB();

//   // const providerManager = new ProviderManager(config.providers ?? []);

//   // const serviceManager = new ServiceManager(config.services ?? []);

//   // const agentManager = new AgentManager(config.agents ?? []);

//   // console.log('[CONTEXT AGENTS]', config.agents);

//   // console.log('[AGENT MANAGER]', agentManager.getAll());

//   return {

//     db: runtime.db,

//     protocol: runtime.protocol,

//     agents: runtime.agents,

//     providers: runtime.providers,

//     services: runtime.services,

//     events: runtime.events,

//     execution: runtime.execution,

//     state: {},

//     // prompt(...) {

//     //     runtime.protocol.addMethod(...);

//     // }

// }

  // return {
  //   apiKey: config?.apiKey,

  //   db,

  //   state: {},

  //   protocol: config.protocol,

  //   agents: agentManager,

  //   providers: providerManager,

  //   services: serviceManager,

  //   events: config.events!, //ts can't fully infer this, but im ensure it's set in bootstrapRuntime

  //   execution: new ExecutionManager(),

  //   prompt(route: string, handler: Function) {
  //     config.protocol?.addMethod(route, handler);
  //   },

  //   //flow: config.flow,
  // };
//}
