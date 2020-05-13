import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
class Sockets {
  private clients: Socket[] = [];

  public addClient(client: Socket): void {
    this.clients.push(client);
  }

  public removeClient(socket: Socket): void {
    this.clients.splice(this.clients.indexOf(socket), 1);
  }

  public sendAll(event: string, data: any) {
    this.clients.forEach((socket) => {
      socket.emit(event, data);
    });
  }
}

export default Sockets;
