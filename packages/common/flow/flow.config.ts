import { FlowAction } from "./flow-action.type";


export interface FlowConfig {
    name:string;
    route: string;
    actions: FlowAction[];
}