import { Action } from './action.interface.js';

export interface ServiceAction extends Action {
  type: 'service';
  service: string;
}