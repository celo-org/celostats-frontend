import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'
import * as io from 'socket.io-client'

import { environment } from 'src/environments/environment'

import {
  Events,
  BlockStats,
  ChartData,
  ClientPing,
  ClientPong,
  LastBlock,
  Latency,
  NodeSummary,
  Pending,
  StatsResponse
} from '@celo/celostats-server'

export interface Event<E extends Events, D> {
  event: E
  data: D
}

export type EthstatsEvent =
  Event<Events.Block, BlockStats> |
  Event<Events.Pending, Pending> |
  Event<Events.Add, NodeSummary> |
  Event<Events.LastBlock, LastBlock> |
  Event<Events.Latency, Latency> |
  Event<Events.Stats, StatsResponse> |
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

      this.socket.on('connect', () => this.socket.emit(Events.Ready))

      this.socket.on(Events.ClientPing, (data: ClientPing) => this.socket.emit(
        Events.ClientPong, {
          serverTime: data.serverTime,
          clientTime: Date.now()
        } as ClientPong
      ))

      this.socket.on(Events.Error, (e) => observer.error(e))
    })
      .pipe(
        mergeMap(_ => this.serializeData(_)),
        share(),
      )
  }

  data<E extends Events, D>(): Observable<EthstatsEvent> {
    return this.data$ as any
  }

  private serializeData(message: EthstatsEvent): Observable<EthstatsEvent> {
    if (message.event === Events.Init) {
      return of(...message.data.map(node => ({event: Events.Add, data: node}) as any))
    }
    return of(message)
  }
}
