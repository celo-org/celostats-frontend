import { Node, RawDataCharts } from 'src/app/shared/store/raw-data'
import { color, colorRange, formatNumber } from 'src/app/shared'
import { infoType } from 'src/app/components/info'
import { chartData, chartSizeType } from 'src/app/components/chart'
import {
  BlockSummary,
  Miner
} from '@celo/celostats-server'

export interface Context {
  block: BlockSummary
  nodes: Node[]
  charts: RawDataCharts
  time: number
}

interface InfoBlockBase<T extends infoType, V, R = V> {
  icon: string
  title: string
  type: T
  accessor: (context: Context) => V
  show?: (value: V, context: Context) => R
  needsUpdate?: (newValue: V, oldValue: V) => boolean
  color: (value: V, context: Context) => color
}
interface InfoBlockSingle extends InfoBlockBase<'small' | 'medium' | 'big', string | number> {}
interface InfoBlockChart extends InfoBlockBase<'chart', any[], chartData> {
  sizeType: chartSizeType
}
interface InfoBlockBlockProposers extends InfoBlockBase<'block-proposers', Miner[]> {}
export type InfoBlock = InfoBlockSingle | InfoBlockChart | InfoBlockBlockProposers

export const blocks: InfoBlock[][] = [
  [
    {
      type: 'big',
      title: 'Block',
      icon: 'archive',
      accessor: ({block}) => '#' + formatNumber(block.number, 0),
      color: () => 'info',
    },
    {
      type: 'chart',
      title: 'Block time',
      icon: 'av_timer',
      accessor: ({charts}) => (charts?.blocktime ?? []),
      show: (data, {charts, block: {number: block}}) => data
        .map((value, i) => ({
          value,
          show: `${value.toFixed(3)} s`,
          index: String(block - i),
          label: `#${block - i}`,
        })),
      needsUpdate: (a, b) => JSON.stringify(a) !== JSON.stringify(b),
      color: () => 'ok',
      sizeType: 'relative',
    },
    {
      type: 'chart',
      title: 'Propagation time',
      icon: 'wifi_tethering',
      accessor: ({charts}) => (charts?.propagation?.histogram ?? []),
      show: data => data
        .map(({x, dx, y: value, cumpercent}, i, {length}) => ({
          value,
          show: `Percent: ${(value * 100).toFixed(2)}%\nCumulative: ${(cumpercent * 100).toFixed(2)}%`,
          label: `${x / 1000}s - ${(x + dx) / 1000}s`,
        })),
      needsUpdate: (a, b) => JSON.stringify(a) !== JSON.stringify(b),
      color: () => 'info',
      sizeType: 'absolute',
    },
  ],
  [
    {
      type: 'big',
      title: 'Blocks until epoch/\nEpoch size',
      icon: 'archive',
      accessor: ({block}) => `${block.blockRemain}/${block.epochSize}`,
      color: (value, {block}) => colorRange((block?.epochSize - +value) / block?.epochSize, [0, 0.5, 0.8]),
    },
    {
      type: 'medium',
      title: 'Last block',
      icon: 'hourglass_empty',
      accessor: ({block, time}) => Math.round((time - +block?.received) / 1000),
      show: value => `${value}s ago`,
      color: value => colorRange(+value, [4, 10, 30, 60, 120, 300]),
    },
    {
      type: 'medium',
      title: 'Avg Block time',
      icon: 'timer',
      accessor: ({charts}) => +charts?.avgBlocktime,
      show: value => `${(+value).toFixed(2)}s`,
      color: value => colorRange(+value, [, 10, 30, 60, 600]),
    },
  ],
  [
    {
      type: 'big',
      title: 'Active nodes',
      icon: 'remove_from_queue',
      accessor: ({nodes}) => nodes.filter(node => node.stats?.active).length,
      show: (value, {nodes}) => `${value}/${nodes.length}`,
      color: (value, {nodes}) => colorRange((nodes.length - +value) / nodes.length, [, 0.1, 0.2, 0.5, , ]),
    },
    {
      type: 'small',
      title: 'Gas price',
      icon: 'money',
      accessor: ({nodes}) => nodes[0]?.stats?.gasPrice / 10 ** 9,
      needsUpdate: (newValue, oldValue) => newValue !== 0 || !oldValue,
      show: value => `${value} gwei`,
      color: () => 'info',
    },
    {
      type: 'small',
      title: 'Gas Limit',
      icon: 'money',
      accessor: ({block}) => block.gasLimit,
      show: value => `${value} gas`,
      color: () => 'info',
    },
    {
      type: 'chart',
      title: 'Gas spending',
      icon: 'attach_money',
      accessor: ({charts, block: {number: block}}) => (charts?.gasSpending ?? [])
        .map((value, i, {length}) => ({
          value,
          show: formatNumber(value, 0),
          index: String(length - charts?.updates + i),
          label: `#${block - i}`,
        })),
      needsUpdate: (a, b) => JSON.stringify(a) !== JSON.stringify(b),
      color: () => 'ok',
      sizeType: 'relative',
    },
  ],
  [
    {
      type: 'big',
      title: 'Elected/Registered \nvalidators',
      icon: 'check_circle_outside',
      accessor: ({block}) => `${block.validators?.elected ?? 0}/${block.validators?.registered ?? 0}`,
      color: value => value ? 'ok' : 'no',
    },
    {
      type: 'block-proposers',
      title: 'Recent block proposers',
      icon: 'done_all',
      accessor: ({charts}) => (charts?.miners ?? []),
      needsUpdate: (a, b) => JSON.stringify(a) !== JSON.stringify(b),
      color: () => 'info',
    },
  ],
]
