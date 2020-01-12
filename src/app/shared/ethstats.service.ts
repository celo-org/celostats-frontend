import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { share } from 'rxjs/operators'

import { environment } from '../../environments/environment'

import { EthstatsNode } from './store/ethstats'

@Injectable({
  providedIn: 'root'
})
export class EthstatsService {
  private data$: Observable<{action: string, data: Partial<EthstatsNode>}>
  private webSocket: WebSocket

  constructor() {
    const url = environment.ethstatsService
    this.webSocket = new WebSocket(url)
    this.data$ = new Observable<any>(observer => {
      this.webSocket.onmessage = ({data}) => observer.next(JSON.parse(data))
      this.webSocket.onerror = e => observer.error(e)
      // TODO: Implement reconnection
      this.webSocket.onclose = () => observer.complete()
      // setTimeout(() => this.webSocket.close(), 6000)
    })
      .pipe(share())
  }

  data() {
    return this.data$
  }
}
