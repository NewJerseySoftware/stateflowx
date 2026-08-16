import { Action } from './action.interface.js';

export interface StoreAction extends Action {
  type: 'store';
  operation: 'get' | 'set' | 'delete' | 'clear';
  key?: string;
}