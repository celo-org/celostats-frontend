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
    case node.validatorData?.elected || node.stats?.elected:
      return StakingState.Elected
    case node.validatorData?.registered || node.stats?.registered:
      return StakingState.Registered
    case node.stats?.proxy:
      return StakingState.Proxy
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
    accessor: node => node.stats?.active,
    show: value => value ? 'wifi' : 'wifi_off',
    color: value => value === true ? 'ok' : value === false ? 'warn3' : 'no',
  },
  {
    name: 'Name',
    icon: 'face',
    default: 1,
    variants: ['sticky'],
    accessor: node => node.info?.name || '',
  },
  {
    name: 'Address',
    icon: 'person',
    type: 'address',
    accessor: node => node.id.toString(),
    link: value => value && `${environment.blockscoutUrl}/address/${value}/transactions`,
  },
  {
    name: 'Validator group',
    icon: 'group',
    type: 'address',
    accessor: node => node.validatorData?.affiliation?.toString() || '',
    link: value => value && `${environment.blockscoutUrl}/address/${value}/transactions`,
  },
  {
    name: 'Validator',
    icon: 'done_all',
    first: -1,
    variants: ['large'],
    accessor: node => evaluateStakingState(node),
    show: (value: string) => StakingState[value],
    color: value => colorRange(3 - +value, [0, 1, 2, , , ,]),
  },
  {
    name: 'Pending transactions',
    icon: 'hourglass_empty',
    variants: ['xsmall'],
    accessor: node => node.stats?.pending,
    color: value => value === 0 ? 'info' : !value ? 'no' : 'ok',
  },
  {
    name: 'Transactions in last block',
    icon: 'compare_arrows',
    variants: ['xsmall'],
    accessor: node => !node.stats?.active ? null : node.stats?.block?.transactions || 0,
  },
  {
    name: 'Block',
    icon: 'archive',
    variants: ['medium'],
    accessor: node => node.block?.number,
    link: value => value && `${environment.blockscoutUrl}/blocks/${value}/transactions`,
    show: value => value ? '# ' + formatNumber(+value, 0) : null,
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 5, 30]) : 'no',
  },
  {
    name: 'Block Time',
    icon: 'timer',
    variants: ['medium'],
    // tslint:disable-next-line:no-bitwise
    accessor: (node, {time}) => !node.block?.received ? null : ~~((time - +node.block?.received) / 1000),
    show: value => timeAgo(value as number),
    color: value => value !== null ? colorRange(+value, [, 10, 30, 60, 60 * 60]) : 'no',
  },
  {
    name: 'Peers',
    icon: 'people',
    variants: ['xsmall'],
    accessor: node => node.stats?.peers,
    color: value => value === 0 ? 'warn3' : value ? 'ok' : 'no',
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
    accessor: node => node.stats?.latency,
    show: value => value === 0 ? `0 ms` : value ? `+${value} ms` : null,
    color: value => value === null ? 'no' : colorRange(+value, [0, 10, 100, 1000, 10000]),
  },
  {
    name: 'Propagation time',
    icon: 'wifi_tethering',
    variants: ['medium'],
    accessor: node => node.block?.propagation,
    show: (value, {node}) => value ? `${value} ms` : null,
    color: (value, {node}) => value === null ? 'no' : colorRange(+value, [10, 100, 1000, 10000, 100000]),
  },
  {
    name: 'Uptime',
    icon: 'offline_bolt',
    variants: ['small'],
    accessor: node => node.stats?.uptime,
    show: value => value !== null ? `${value} %` : null,
    color: value => value === null ? 'no' : colorRange(100 - +value, [, 0.1, 1, 5, 10, 20]),
  },
  {
    name: 'ECDSA Public Key',
    icon: 'lock',
    variants: ['medium'],
    accessor: node => node.validatorData?.ecdsaPublicKey,
  },
  {
    name: 'BLS Public Key',
    icon: 'lock',
    variants: ['medium'],
    accessor: node => node.validatorData?.blsPublicKey,
  },
]
