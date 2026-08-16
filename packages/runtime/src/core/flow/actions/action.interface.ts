import { Connector } from '../connectors/connector.interface.js';

export interface Action {
    id: string;
    log?:boolean;
    output?:boolean;
    inputConnectors?: Connector[];
    outputConnectors?: Connector[];
}