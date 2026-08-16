import { FlowAction } from "./flow-action.type.js";


export interface Flow {
  route: string;
  actions: FlowAction[];
}