import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'
import * as io from 'socket.io-client'

import { environment } from 'src/environments/environment'

import { EthstatsCharts, EthstatsNode } from './store/ethstats'
import { Events } from '@celo/celostats-server/src/server/server/Events'

// todo: Sebastian: i tried a long time removing this and i failed. Please make it more obvious
export interface EthstatsServiceDataNode {
  action: Events.Init | Events.Add | Events.Block | Events.Pending | Events.Stats
  data: Partial<EthstatsNode>
}

// todo: Sebastian: i tried a long time removing this and i failed. Please make it more obvious
export interface EthstatsServiceDataCharts {
  action: Events.Charts
  data: EthstatsCharts
}

// todo: Sebastian: i tried a long time removing this and i failed. Please make it more obvious
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

      const events: Events[] = [
        Events.Init, Events.Block, Events.Latency,
        Events.Pending, Events.Add, Events.Inactive,
        Events.Charts, Events.Stats, Events.LastBlock
      ]

      events.forEach((action) => this.socket.on(action, data => observer.next({action, data})))

      this.socket.on(Events[Events.Error], e => observer.error(e))
      this.socket.on(Events[Events.Connection], () => this.socket.emit('ready'))

      // setTimeout(() => this.socket.close(), 2000)
    })
      .pipe(
        mergeMap(_ => this.serializeData(_)),
        share(),
      )
  }

  // todo: Sebastian: i tried a long time removing this and i failed. Please make it more obvious
  data<type extends 'node' | 'charts'>(): Observable<type extends 'node' ? EthstatsServiceDataNode : EthstatsServiceDataCharts> {
    return this.data$ as any
  }

  // todo: Sebastian: i tried a long time removing this and i failed. Please make it more obvious
  private serializeData(message: any): Observable<EthstatsServiceData> {
    const {action, data} = message
    if (action === 'init') {
      return of(...data.map((node) => ({action, data: node})))
    }
    return of(message)
  }
}
