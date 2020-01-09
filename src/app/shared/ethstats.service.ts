import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EthstatsService {
  private webSocket: WebSocket

  constructor() {
    const url = environment.ethstatsService
    this.webSocket = new WebSocket(url)
    this.webSocket.onmessage = ({data}) => this.onMessage(data)
  }

  private onMessage(data: any) {
  }
}
