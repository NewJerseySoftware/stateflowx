import { FlowConfig } from "@stateflowx/common";
import { WorkflowConfig } from "./workflow/workflow.config.js";

export interface OrchestrationConfig {
  flows?: FlowConfig[];
  workflows?: WorkflowConfig[];
}