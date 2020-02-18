import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'
import * as io from 'socket.io-client'

import { environment } from 'src/environments/environment'

import { Events } from '@celo/celostats-server/src/server/server/Events'
import { BlockSummary } from '@celo/celostats-server/src/server/interfaces/BlockSummary'
import { Pending } from '@celo/celostats-server/src/server/interfaces/Pending'
import { NodeSummary } from '@celo/celostats-server/src/server/interfaces/NodeSummary'
import { ChartData } from '@celo/celostats-server/src/server/interfaces/ChartData'
import { Latency } from '@celo/celostats-server/src/server/interfaces/Latency'

export interface Event<E extends Events | string, D> {
  event: E
  data: D
}

export type EthstatsEvent =
  Event<Events.Block, BlockSummary> |
  Event<Events.Pending, Pending> |
  Event<Events.Add, NodeSummary> |
  // todo make this a real interface
  Event<Events.LastBlock, {
    highestBlock: number
  }> |
  Event<Events.Latency, Latency> |
  Event<Events.Init, NodeSummary[]> |
  Event<Events.Charts, ChartData>

@Injectable({
  providedIn: 'root'
})
export class EthstatsService {
  private data$: Observable<EthstatsEvent>
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

      events.forEach((event: Events) => this.socket.on(event, (data) => observer.next({event, data})))

      this.socket.on(Events.Error, e => observer.error(e))
      this.socket.on(Events.Connection, () => this.socket.emit('ready'))
    })
      .pipe(
        mergeMap(_ => this.serializeData(_)),
        share(),
      )
  }

  data<T>(): Observable<EthstatsEvent> {
    return this.data$ as any
  }

  private serializeData(message: EthstatsEvent): Observable<EthstatsEvent> {
    if (message.event === Events.Init) {
      return of(...message.data.map(node => ({event: Events.Add, data: node}) as Event<Events.Add, NodeSummary>))
    }
    return of(message)
  }
}
