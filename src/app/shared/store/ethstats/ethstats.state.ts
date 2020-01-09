export interface EthstatsNode {
  address: string
}

export interface State {
  nodes: {[address: string]: EthstatsNode}
}
