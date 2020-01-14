export interface EthstatsBlock {
  number: number
  hash: string
  arrived: number
  blockRemain: number
  difficulty: string
  epochSize: number
  fork: number
  gasLimit: number
  gasUsed: number
  miner: string
  parentHash: string
  propagation: number
  received: number
  stateRoot: number
  time: number
  timestamp: number
  totalDifficulty: string
  transactions: any[]
  transactionsRoot: string
  trusted: boolean
  uncles: any[]
  validators: any
}

export interface EthstatsNodeUptime {
  started: number
  up: number
  down: number
  lastStatus: boolean
  lastUpdate: number
}

export interface EthstatsNode {
  block: EthstatsBlock
  history: number[]
  id: string
  info: EthstatsInfo
  pending: number
  propagationAvg: number
  stats: EthstatsStats
  validatorData: any
  uptime: EthstatsNodeUptime
}

export interface EthstatsInfo {
  api: boolean
  canUpdateHistory: boolean
  client: string
  name: string
  net: string
  node: string
  os: string
  os_v: string
  port: number
  protocol: string
}

export interface EthstatsStats {
  active: boolean
  elected: boolean
  gasPrice: number
  hashrate: number
  latency: string
  mining: boolean
  peers: number
  syncing: boolean
  uptime: number
}

export interface State {
  nodes: {[id: string]: EthstatsNode}
  lastBlock: EthstatsBlock
}
