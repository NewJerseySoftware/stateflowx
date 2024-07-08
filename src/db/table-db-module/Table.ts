import { ITable } from './table.interface';

export class Table implements ITable {
  public gameID: string;
  public players: any[] = [];
  public watchers: any[] = [];

  private _name: string;
  private _createAt: any;
  private _updatedAt: any;
  private _uri: string;
  private _maxClients: number;

  constructor(
    uri: string,
    name: string,
    maxClients: number,
    createdAt: any,
    updatedAt: any,
  ) {
    this.uri = uri;
    this.maxClients = maxClients;
    this.name = name;
    this._createAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public get uri(): string {
    return this._uri;
  }

  private set uri(value: string) {
    this._uri = value;
  }

  public get maxClients(): number {
    return this._maxClients;
  }

  private set maxClients(value: number) {
    this._maxClients = value;
  }

  public get name(): string {
    return this._name;
  }

  private set name(value: string) {
    this._name = value;
  }

  public get createAt(): any {
    return this._createAt;
  }

  public get updatedAt(): any {
    return this._updatedAt;
  }
}
