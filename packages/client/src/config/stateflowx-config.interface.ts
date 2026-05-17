import { TransportConfig } from "../transport/transport-config.interface.js";

export interface StateFlowXConfig {
  protocol: unknown;
  transport: TransportConfig;
  providers?: unknown[];
}
