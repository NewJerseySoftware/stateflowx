import { ProviderSelection } from "../provider/provider-selection.interface.js";

import { ServiceConfig } from "../service/service-config.interface.js";
import { WorkflowConfig } from "../workflow/workflow-config.interface.js";

export interface RuntimeInitializationConfig {
  apiKey?: string;

  providers: ProviderSelection[];

  services: ServiceConfig[];

  workflows: WorkflowConfig[];
}