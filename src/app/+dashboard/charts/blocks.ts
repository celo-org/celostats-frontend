import { EthstatsNode, EthstatsBlock, EthstatsCharts, EthstatsMinedBlock } from 'src/app/shared/store/ethstats'
import { color, colorRange, formatNumber } from 'src/app/shared'
import { infoType } from 'src/app/components/info'
import { chartData, chartSizeType } from 'src/app/components/chart'

export interface Context {
  block: EthstatsBlock
  nodes: EthstatsNode[]
  charts: EthstatsCharts
  time: number
}

interface InfoBlockBase<T extends infoType> {
  icon: string
  title: string
  type: T
}
interface InfoBlockSingle extends InfoBlockBase<'small' | 'big'> {
  accessor: (context: Context) => string | number
  show?: (value: string | number, context: Context) => string | number
  color: (value: string | number, context: Context) => color
}
interface InfoBlockChart extends InfoBlockBase<'chart'> {
  accessor: (context: Context) => chartData
  color: (value: chartData, context: Context) => color
  sizeType: chartSizeType
}
interface InfoBlockBlockProposers extends InfoBlockBase<'block-proposers'> {
  accessor: (context: Context) => EthstatsMinedBlock[]
  color: (value: EthstatsMinedBlock[], context: Context) => color
}
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
      type: 'small',
      title: 'Last block',
      icon: 'hourglass_empty',
      accessor: ({block, time}) => Math.round((time - +block?.received) / 1000),
      show: value => `${value}s ago`,
      color: value => colorRange(+value, [, 10, 30, 60, 600]),
    },
    {
      type: 'small',
      title: 'Avg Block time',
      icon: 'timer',
      accessor: ({charts}) => +charts?.avgBlocktime,
      show: value => `${(+value).toFixed(2)}s`,
      color: value => colorRange(+value, [, 10, 30, 60, 600]),
    },
    {
      type: 'chart',
      title: 'Block time',
      icon: 'av_timer',
      accessor: ({charts, block: {number}}) => (charts?.blocktime ?? [])
        .map((value, i, {length}) => ({
          value,
          show: `${value.toFixed(3)} s`,
          index: String(length - charts?.updates + i),
          label: `#${number - i}`,
        })),
      color: () => 'ok',
      sizeType: 'relative',
    },
  ],
  [
    {
      type: 'big',
      title: 'Blocks until epoch',
      icon: 'archive',
      accessor: ({block}) => block.blockRemain,
      color: (value, {block}) => colorRange((block?.epochSize - +value) / block?.epochSize, [0, 0.5, 0.8]),
    },
    {
      type: 'small',
      title: 'Epoch size',
      icon: 'archive',
      accessor: ({block}) => block.epochSize,
      color: () => 'warn1',
    },
    {
      type: 'chart',
      title: 'Propagation time',
      icon: 'wifi_tethering',
      accessor: ({charts, block: {number}}) => (charts?.propagation?.histogram ?? [])
        .map(({x, dx, y: value, cumpercent}, i, {length}) => ({
          value,
          show: `Percent: ${(value * 100).toFixed(2)}%\nCumulative: ${(cumpercent * 100).toFixed(2)}%`,
          label: `${x / 1000}s - ${(x + dx) / 1000}s`,
        })),
      color: () => 'info',
      sizeType: 'absolute',
    },
  ],
  [
    {
      type: 'small',
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
      accessor: ({charts, block: {number}}) => (charts?.gasSpending ?? [])
        .map((value, i, {length}) => ({
          value,
          show: formatNumber(value, 0),
          index: String(length - charts?.updates + i),
          label: `#${number - i}`,
        })),
      color: () => 'ok',
      sizeType: 'relative',
    },
  ],
  [
    {
      type: 'big',
      title: 'Elected validators',
      icon: 'check_circle_outside',
      accessor: ({block}) => block.validators?.elected ?? 0,
      color: value => value ? 'ok' : 'no',
    },
    {
      type: 'small',
      title: 'Registered validators',
      icon: 'check',
      accessor: ({block}) => block.validators?.registered ?? 0,
      color: (value, {block}) => value === block.validators?.elected ? 'warn1' : 'warn2',
    },
    {
      type: 'block-proposers',
      title: 'Recent block proposers',
      icon: 'done_all',
      accessor: ({charts, block: {number}}) => (charts?.miners ?? []),
      color: () => 'info',
    },
  ],
]
