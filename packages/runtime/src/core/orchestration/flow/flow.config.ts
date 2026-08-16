import { FlowAction } from "../../flow/flow-action.type.js";

export interface FlowConfig {
    name:string;
    route: string;
    actions: FlowAction[];
}