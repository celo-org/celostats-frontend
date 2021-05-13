import { SignedState } from '@celo/celostats-server'

import { environment } from 'src/environments/environment'
import { Node } from 'src/app/shared/store/raw-data'
import { colorRange, formatNumber, timeAgo } from 'src/app/shared'
import { Column } from './nodes-sorting.state'

export enum StakingState {
  Proxy,
  Elected,
  Registered,
  'Full Node',
}

function evaluateStakingState(node: Node) {
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

const signedColors = {
  [SignedState.Signed]: 'ok',
  [SignedState.Unsigned]: 'warn2',
  [SignedState.Unknown]: 'warn1',
  [SignedState.Skipped]: 'info',
  [SignedState.Punished]: 'warn3',
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
    name: 'Validator',
    icon: 'face',
    default: -1,
    variants: ['sticky'],
    type: (node) => node.info?.name ? undefined : 'address',
    accessor: (node) => {
      return node.info?.name || node.id.toString()
    },
    show: value => value || '',
    link: (value, {node}) => value && `${environment.blockscoutUrl}/address/${node.id.toString()}/transactions`,
  },
  {
    name: 'Version',
    icon: 'code',
    variants: ['xlarge'],
    accessor: (node) => node.info?.node?.split('/')?.[1]
  },
  {
    name: 'Validator group',
    icon: 'group',
    type: (node, {validatorsGroups}) => validatorsGroups[node.validatorData?.affiliation?.toString()]?.name ? undefined : 'address',
    accessor: (node, {validatorsGroups}) => {
      const group = node.validatorData?.affiliation?.toString()
      if (group) {
        return validatorsGroups[node.validatorData?.affiliation?.toString()]?.name || group
      }
    },
    show: value => value || '',
    link: (value, {node}) => value && `${environment.blockscoutUrl}/address/${node.validatorData?.affiliation?.toString()}/transactions`,
  },
  {
    name: 'State',
    icon: 'done_all',
    first: -1,
    variants: ['medium'],
    accessor: node => evaluateStakingState(node),
    show: (value: string) => StakingState[value],
    color: value => colorRange(+value, [0, 1, 2, , , ,]),
  },
  {
    name: 'Pending transactions',
    icon: 'hourglass_empty',
    variants: ['xsmall', 'right'],
    accessor: node => node.stats?.pending,
    color: value => value === 0 ? 'info' : !value ? 'no' : 'ok',
  },
  {
    name: 'Transactions in last block',
    icon: 'compare_arrows',
    variants: ['xsmall', 'right'],
    accessor: node => !node.stats?.active ? null : node.block?.transactions || 0,
  },
  {
    name: 'Block',
    icon: 'archive',
    variants: ['medium'],
    accessor: node => node.block?.number,
    link: value => value && `${environment.blockscoutUrl}/blocks/${value}/transactions`,
    show: value => value ? formatNumber(+value, 0) : null,
    color: (value, {block}) => value ? colorRange(block - +value, [, 0, 1, 5, 30]) : 'no',
  },
  {
    name: 'Block Time',
    icon: 'timer',
    variants: ['xsmall', 'right'],
    // tslint:disable-next-line:no-bitwise
    accessor: (node, {time}) => !node.block?.received ? null : ~~((time - +node.block?.received) / 1000),
    show: value => timeAgo(value as number),
    color: value => value !== null ? colorRange(+value, [, 10, 30, 60, 60 * 60]) : 'no',
  },
  {
    name: 'Peers',
    icon: 'people',
    variants: ['xsmall', 'right'],
    accessor: node => node.stats?.peers,
    color: value => value === 0 ? 'warn3' : value ? 'ok' : 'no',
  },
  {
    name: 'Score',
    icon: 'trending_up',
    variants: ['medium', 'right'],
    accessor: node => node.validatorData?.score,
    show: (value: number) => `${truncateToDecimals(value, 4)}%`,
    color: value => colorRange(100 - +value, [0, 0.1, 1, 5, 20, 90]),
  },
  {
    name: 'Latency',
    icon: 'timer',
    variants: ['medium', 'right'],
    accessor: node => node.stats?.latency,
    show: value => value === 0 ? `0 ms` : value ? `+${value} ms` : null,
    color: value => value === null ? 'no' : colorRange(+value, [0, 10, 100, 1000, 10000]),
  },
  {
    name: 'Propagation time',
    icon: 'wifi_tethering',
    variants: ['medium', 'right'],
    accessor: node => node.block?.propagation,
    show: (value, {node}) => timeAgo(value as any, true, 10000) || null,
    color: (value, {node}) => value === null ? 'no' : colorRange(+value, [50, 500, 4000, 20000, 60000]),
  },
  {
    name: 'Propagation history',
    icon: 'wifi_tethering',
    type: 'chart',
    accessor: node => (node.history || []).map(_ => _ === -1 ? undefined : _),
    show: (value) => timeAgo(value as any, true, 5000),
    color: (value) => value === -1 ? 'no' : colorRange(+value, [50, 500, 4000, 20000, 60000]),
  },
  {
    name: 'Singing history',
    icon: 'assignment_turned_in',
    type: 'chart',
    accessor: node => [...(node.signHistory || []), ...new Array(40).fill(null)].slice(0, 40).map(data => ({
      value: 1,
      data
    })),
    show: (value, data) => SignedState[data] || 'n/a',
    color: (value, data) => signedColors[data] || 'no',
  },
  {
    name: 'Uptime',
    icon: 'offline_bolt',
    variants: ['xsmall', 'right'],
    accessor: node => node.stats?.uptime,
    show: value => value !== null ? `${formatNumber(value, 0)}%` : null,
    color: value => value === null ? 'no' : colorRange(100 - +value, [, 0.1, 1, 5, 10, 20]),
  },
  {
    name: 'ECDSA Public Key',
    icon: 'lock',
    variants: ['medium', 'grow'],
    accessor: node => node.validatorData?.ecdsaPublicKey,
    color: value => value === null ? 'no' as any : null,
  },
  {
    name: 'BLS Public Key',
    icon: 'lock',
    variants: ['medium', "grow"],
    accessor: node => node.validatorData?.blsPublicKey,
    color: value => value === null ? 'no' as any : null,
  },
]
