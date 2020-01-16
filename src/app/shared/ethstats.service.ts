import { Injectable } from '@angular/core'
import { Observable, of, empty } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'

import { environment } from '../../environments/environment'

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
  private webSocket: WebSocket

  constructor() {
    const url = environment.ethstatsService
    this.webSocket = new WebSocket(url)
    this.data$ = new Observable<any>(observer => {
      this.webSocket.onmessage = ({data}) => observer.next(JSON.parse(data))
      this.webSocket.onerror = e => observer.error(e)
      // TODO: Implement reconnection
      this.webSocket.onclose = () => observer.complete()

      this.webSocket.onopen = () => this.webSocket.send(JSON.stringify({emit: ['ready']}))
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
    if (message.emit) {
      const [action, content] = message.emit
      switch (action) {
        case 'init': return of(...content.nodes.map(data => ({action, data})))
      }
    }
    return empty()
  }
}
