import { AgentProvider } from "./provider-execution-request.interface.js";

export interface RegisteredAgentProvider {
    name: string;

    priority?: number; //optional at registrtion time

    retry: {
        attempts: number;
        delay: number;
    };

    timeout: number;

    provider: AgentProvider;
}