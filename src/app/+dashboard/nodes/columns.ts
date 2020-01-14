import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color, colorRange, formatNumber } from 'src/app/shared'

export interface Context {
  block: number
  node: EthstatsNode
}

export interface Column {
  name: string
  icon: string
  default?: boolean
  first?: boolean
  accessor: (node: EthstatsNode) => string | number
  show?: (value: string | number, context: Context) => string | number
  color?: (value: string | number, context: Context) => color
}

export const columns: Column[] = [
  {name: 'Name', icon: 'face', default: true, accessor: node => node.info?.name},
  {name: 'ID', icon: 'person', accessor: node => node.id},
  {
    name: 'Peers',
    icon: 'people',
    accessor: node => node.stats?.peers || 0,
    color: value => value ? 'ok' : 'no',
  },
  {name: 'Pending', icon: 'hourglass_empty', accessor: node => node.pending || 0},
  {
    name: 'Block',
    icon: 'archive',
    first: true,
    accessor: node => node.block?.number,
    show: value => value ? '# ' + formatNumber(+value, 0) : 'n/a',
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 5, 30]) : 'no',
  },
  {name: 'Transactions', icon: 'compare_arrows', accessor: node => node.block?.transactions.length || 0},
  {
    name: 'Block Time',
    icon: 'timer',
    accessor: node => node.block?.received ? Math.round((Date.now() - +node.block?.received) / 1000) : -Infinity,
    show: value => value !== -Infinity ? value + ' s ago' : 'n/a',
    color: value => value !== -Infinity ? colorRange(+value, [, 10, 30, 60, 600]) : 'no',
  },
  {
    name: 'Latency',
    icon: 'timer',
    accessor: node => +node.stats?.latency || 0,
    show: value => value === 0 ? `${value} ms` : value ? `+${value} ms` : '',
    color: value => colorRange(+value, [0, 10, 100, 1000, 100000]),
  },
  {name: 'Propagation', icon: 'wifi', accessor: node => node.block?.propagation},
  {
    name: 'Uptime',
    icon: 'offline_bolt',
    accessor: node => node.stats?.uptime,
    show: value => `${value} %`,
    color: value => colorRange(100 - +value, [, 0.1, 1, 5, 10, 20]),
  },
]
