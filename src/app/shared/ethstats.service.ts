import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'
import * as io from 'socket.io-client'

import { environment } from 'src/environments/environment'

import { Events } from '@celo/celostats-server/src/server/server/Events'
import { Pending } from '@celo/celostats-server/src/server/interfaces/Pending'
import { NodeSummary } from '@celo/celostats-server/src/server/interfaces/NodeSummary'
import { ChartData } from '@celo/celostats-server/src/server/interfaces/ChartData'
import { Latency } from '@celo/celostats-server/src/server/interfaces/Latency'
import { BlockStats } from "@celo/celostats-server/src/server/interfaces/BlockStats"
import { NodeDetails } from "@celo/celostats-server/src/server/interfaces/NodeDetails"
import { StatsResponse } from "@celo/celostats-server/src/server/interfaces/StatsResponse"
import { ClientPing } from "@celo/celostats-server/src/server/interfaces/ClientPing"
import { ClientPong } from "@celo/celostats-server/src/server/interfaces/ClientPong"
import { LastBlock } from "@celo/celostats-server/src/server/interfaces/LastBlock"

export interface Event<E extends Events, D> {
  event: E
  data: D
}

export type EthstatsEvent =
  Event<Events.Block, BlockStats> |
  Event<Events.Pending, Pending> |
  Event<Events.Add, NodeDetails> |
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
        Events.ClientPong,
        <ClientPong>{
          serverTime: data.serverTime,
          clientTime: Date.now()
        }))

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
