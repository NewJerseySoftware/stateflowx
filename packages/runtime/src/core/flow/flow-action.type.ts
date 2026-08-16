import { ProviderAction } from './actions/provider-action.interface.js';
import { ServiceAction } from './actions/service-action.interface.js';
import { StoreAction } from './actions/store-action.interface.js';

export type FlowAction =
  | ServiceAction
  | ProviderAction
  | StoreAction;