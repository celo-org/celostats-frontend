import { environment } from 'src/environments/environment'
import { EthstatsNode } from 'src/app/shared/store/ethstats'
import { color, colorRange, formatNumber, timeAgo } from 'src/app/shared'
import { Column } from './nodes-sorting.state'

export enum StakingState {
  'Full Node',
  Registered,
  Elected,
  Proxy
}

function evaluateStakingState(node: EthstatsNode) {
  switch (true) {
    case node.stats?.proxy: return StakingState.Proxy
    case node.validatorData?.elected || node.stats?.elected: return StakingState.Elected
    case node.validatorData?.registered: return StakingState.Registered
  }
  return StakingState['Full Node']
}

function truncateToDecimals(num: number, dec: number = 2) {
  const calcDec = 10 ** dec
  // tslint:disable-next-line:no-bitwise
  return (~~(num * calcDec) / calcDec).toFixed(dec)
}

export const columns: Column[] = [
  {
    name: 'Status',
    icon: 'done',
    type: 'icon',
    variants: ['xsmall'],
    accessor: node => +node.stats?.active,
    show: value => value ? 'wifi' : 'wifi_off',
    color: value => value ? 'ok' : 'warn3',
  },
  {
    name: 'Name',
    icon: 'face',
    default: 1,
    variants: ['sticky'],
    accessor: node => node.info?.name,
  },
  {
    name: 'Address',
    icon: 'person',
    type: 'address',
    accessor: node => node.id,
    link: value => value && `${environment.blockscoutUrl}/address/${value}/transactions`,
  },
  {
    name: 'Validator group',
    icon: 'group',
    type: 'address',
    accessor: node => node.validatorData?.affiliation,
    link: value => value && `${environment.blockscoutUrl}/address/${value}/transactions`,
  },
  {
    name: 'Validator',
    icon: 'done_all',
    first: -1,
    variants: ['large'],
    accessor: node => evaluateStakingState(node),
    show: value => StakingState[value],
    color: value => colorRange(3 - +value, [0, 1, 2, , , , ]),
  },
  {
    name: 'Pending transactions',
    icon: 'hourglass_empty',
    variants: ['xsmall'],
    accessor: node => node.stats.pending || 0,
    color: value => value ? 'ok' : 'info',
  },
  {
    name: 'Transactions in last block',
    icon: 'compare_arrows',
    variants: ['xsmall'],
    accessor: node => node.block?.transactions?.length || 0,
  },
  {
    name: 'Block',
    icon: 'archive',
    variants: ['medium'],
    accessor: node => node.block?.number,
    link: value => value && `${environment.blockscoutUrl}/blocks/${value}/transactions`,
    show: value => value ? '# ' + formatNumber(+value, 0) : 'n/a',
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 5, 30]) : 'no',
  },
  {
    name: 'Block Time',
    icon: 'timer',
    variants: ['medium'],
    accessor: (node, {time}) => node.block?.received ? Math.round((time - +node.block?.received) / 1000) : -Infinity,
    show: value => value !== -Infinity ? timeAgo(+value) : 'n/a',
    color: value => value !== -Infinity ? colorRange(+value, [, 10, 30, 60, 60 * 60]) : 'no',
  },
  {
    name: 'Peers',
    icon: 'people',
    variants: ['xsmall'],
    accessor: node => node.stats?.peers || 0,
    color: value => value ? 'ok' : 'no',
  },
  {
    name: 'Score',
    icon: 'trending_up',
    variants: ['medium', 'pre'],
    accessor: node => node.validatorData?.score,
    show: (value: number) => `${truncateToDecimals(value, 4).padStart(8, ' ')}%`,
    color: value => colorRange(100 - +value, [0, 0.1, 1, 5, 20, 90]),
  },
  {
    name: 'Latency',
    icon: 'timer',
    variants: ['medium'],
    accessor: node => +node.stats?.latency || 0,
    show: value => value === 0 ? `${value} ms` : value ? `+${value} ms` : '',
    color: value => colorRange(+value, [0, 10, 100, 1000, 10000]),
  },
  {
    name: 'Propagation time',
    icon: 'wifi_tethering',
    variants: ['medium'],
    accessor: node => node.block?.propagation || 0,
    show: (value, {node}) => !node.stats?.active ? 'n/a' : `${value} ms`,
    color: (value, {node}) => !node.stats?.active ? 'no' : colorRange(+value, [10, 100, 1000, 10000, 100000]),
  },
  {
    name: 'Uptime',
    icon: 'offline_bolt',
    variants: ['small'],
    accessor: node => node.stats?.uptime,
    show: value => `${value || 0} %`,
    color: value => colorRange(100 - +value, [, 0.1, 1, 5, 10, 20]),
  },
]
