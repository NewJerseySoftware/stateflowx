import {
  Action,
} from './action.interface.js';

export type StoreType =
  | 'memory'
  | 'mysql';

export interface StoreAction
  extends Action {
  type: 'store';

  store?: StoreType;

  operation:
  | 'get'
  | 'set'
  | 'delete'
  | 'clear';

  key?: string;
}