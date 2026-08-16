import { Action } from './action.interface.js';

export interface ProviderAction extends Action {
  type: 'provider';
  provider?: string;
  prompt: string;
}