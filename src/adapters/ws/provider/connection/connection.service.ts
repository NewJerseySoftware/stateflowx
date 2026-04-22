import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';

@Injectable()
export class ConnectionService {
  websocketsInitiated: string[] = []; // catch all
  clientsInitiated: string[] = []; //catch all

  addClientConnection(id: string): string {
    if (!this.clientsInitiated.includes(id)) {
      this.clientsInitiated.push(id);
      return id;
    }
  }

  addWSConnection(id: string): string {
    if (!this.websocketsInitiated.includes(id)) {
      console.log('New WebSocket Initiated: : ' + id);
      this.websocketsInitiated.push(id);
      return id;
    }
  }

  checkClientConnection(id: string): boolean {
    if (!this.clientsInitiated.includes(id)) {
      return false;
    }
    return true;
  }

  checkWSConnection(id: string): boolean {
    if (!this.websocketsInitiated.includes(id)) {
      return false;
    }
    return true;
  }

  dropClientConnection(id: string): void {
    const check = this.clientsInitiated.indexOf(id);
    if (check > -1) {
      this.clientsInitiated.splice(check, 1);
    }
  }
}
