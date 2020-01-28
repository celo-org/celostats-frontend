import { environment } from '../../../environments/environment'
import { EthstatsNode, StakingState } from 'src/app/shared/store/ethstats'
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
  type?: 'icon' | 'address'
  variants?: ('xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'address')[],
  accessor: (node: EthstatsNode) => string | number
  link?: (value: string | number, context: Context) => string
  show?: (value: string | number, context: Context) => string | number
  color?: (value: string | number, context: Context) => color
}

function evaluateStakingState(node: EthstatsNode) {
  switch (true) {
    case node.stats?.proxy: return StakingState.Proxy
    case node.validatorData?.elected || node.stats?.elected: return StakingState.Elected
    case node.validatorData?.registered: return StakingState.Registered
  }
  return StakingState["Full Node"]
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
    default: true,
    accessor: node => node.info?.name,
  },
  {
    name: 'Address',
    icon: 'person',
    type: 'address',
    variants: ['address'],
    accessor: node => node.id,
    link: value => value && `${environment.blockscoutUrl}/address/${value}/transactions`,
  },
  {
    name: 'Validator group',
    icon: 'group',
    type: 'address',
    variants: ['address'],
    accessor: node => node.validatorData?.affiliation,
    link: value => value && `${environment.blockscoutUrl}/address/${value}/transactions`,
  },
  {
    name: 'Validator',
    icon: 'done_all',
    variants: ['large'],
    accessor: node => evaluateStakingState(node),
    show: value => StakingState[value],
    color: value => colorRange(3 - +value, [0, 1, 2, , , ,]),
  },
  {
    name: 'Peers',
    icon: 'people',
    variants: ['xsmall'],
    accessor: node => node.stats?.peers || 0,
    color: value => value ? 'ok' : 'no',
  },
  {
    name: 'Pending',
    icon: 'hourglass_empty',
    variants: ['xsmall'],
    accessor: node => node.pending || 0,
    color: value => value ? 'ok' : 'info',
  },
  {
    name: 'Block',
    icon: 'archive',
    first: true,
    variants: ['medium'],
    accessor: node => node.block?.number,
    link: value => value && `${environment.blockscoutUrl}/blocks/${value}/transactions`,
    show: value => value ? '# ' + formatNumber(+value, 0) : 'n/a',
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 5, 30]) : 'no',
  },
  {
    name: 'Transactions',
    icon: 'compare_arrows',
    variants: ['xsmall'],
    accessor: node => node.block?.transactions?.length || 0,
  },
  {
    name: 'Block Time',
    icon: 'timer',
    variants: ['medium'],
    accessor: node => node.block?.received ? Math.round((Date.now() - +node.block?.received) / 1000) : -Infinity,
    show: value => value !== -Infinity ? value + ' s ago' : 'n/a',
    color: value => value !== -Infinity ? colorRange(+value, [, 10, 30, 60, 600]) : 'no',
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
    show: value => `${value} %`,
    color: value => colorRange(100 - +value, [, 0.1, 1, 5, 10, 20]),
  },
]
