import { Injectable } from '@angular/core'
import { Observable, of, EMPTY } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'
import * as io from 'socket.io-client'

import { environment } from 'src/environments/environment'

import { EthstatsNode, EthstatsCharts } from './store/ethstats'

export interface EthstatsServiceDataNode {
  action: 'init' | 'add' | 'block' | 'pending' | 'stats'
  data: Partial<EthstatsNode>
}
export interface EthstatsServiceDataCharts {
  action: 'charts'
  data: EthstatsCharts
}

export type EthstatsServiceData = EthstatsServiceDataNode | EthstatsServiceDataCharts

@Injectable({
  providedIn: 'root'
})
export class EthstatsService {
  private data$: Observable<EthstatsServiceData>
  private socket: SocketIOClient.Socket

  constructor() {
    const url = environment.ethstatsService
    this.socket = io(url, {
      path: '/client',
      transports: ['websocket'],
    })
    this.data$ = new Observable<any>(observer => {
      this.socket.on('b', data => observer.next(data))
      this.socket.on('charts', data => observer.next({action: 'charts', data}))
      this.socket.on('init', data => observer.next(['init', data]))

      this.socket.on('error', e => observer.error(e))
      this.socket.on('connect', () => this.socket.emit('ready'))

      // setTimeout(() => this.socket.close(), 2000)
    })
      .pipe(
        mergeMap(_ => this.serializeData(_)),
        share(),
      )
  }

  data<type extends 'node' | 'charts'>(): Observable<type extends 'node' ? EthstatsServiceDataNode : EthstatsServiceDataCharts> {
    return this.data$ as any
  }

  private serializeData(message: any): Observable<EthstatsServiceData> {
    if (message.action && message.data) {
      return of(message)
    }
    if (message instanceof Array) {
      const [action, content] = message
      switch (action) {
        case 'init': return of(...content.map(data => ({action, data})))
      }
    }
    return EMPTY
  }
}
