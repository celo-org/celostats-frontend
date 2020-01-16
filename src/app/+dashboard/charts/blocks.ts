import { EthstatsNode, EthstatsBlock, EthstatsCharts } from 'src/app/shared/store/ethstats'
import { color, colorRange, formatNumber } from 'src/app/shared'
import { infoType } from 'src/app/components/info'

export interface Context {
  block: EthstatsBlock
  nodes: EthstatsNode[]
  charts: EthstatsCharts
}

export interface InfoBlock {
  icon: string
  title: string
  type: infoType
  accessor: (context: Context) => string | number
  show?: (value: string | number, context: Context) => string | number
  color: (value: string | number, context: Context) => color
}

export const blocks: InfoBlock[] = [
  {
    type: 'big',
    title: 'Block',
    icon: 'archive',
    accessor: ({block}) => '#' + formatNumber(block.number, 0),
    color: () => 'info',
  },
  {
    type: 'big',
    title: 'Last block',
    icon: 'hourglass_empty',
    accessor: ({block}) => Math.round((Date.now() - +block?.received) / 1000),
    show: value => `${value}s ago`,
    color: value => colorRange(+value, [, 10, 30, 60, 600]),
  },
  {
    type: 'big',
    title: 'Avg Block time',
    icon: 'timer',
    accessor: ({charts}) => +charts.avgBlocktime,
    show: value => `${(+value).toFixed(2)}s`,
    color: value => colorRange(+value, [, 10, 30, 60, 600]),
  },
  {
    type: 'big',
    title: 'Blocks until epoch',
    icon: 'archive',
    accessor: ({block}) => block.blockRemain,
    color: (value, {block}) => colorRange(block?.epochSize - +value, [0, block?.epochSize * 0.5, block?.epochSize * 0.8]),
  },
  {
    type: 'big',
    title: 'Elected validators',
    icon: 'check_circle_outside',
    accessor: ({block}) => block.validators.elected,
    color: () => 'ok',
  },
  {
    type: 'small',
    title: 'Active nodes',
    icon: 'remove_from_queue',
    accessor: ({nodes}) => nodes.filter(node => node.stats.active).length,
    show: (value, {nodes}) => `${value}/${nodes.length}`,
    color: () => 'ok',
  },
  {
    type: 'small',
    title: 'Gas price',
    icon: 'money',
    accessor: ({block}) => '?',
    show: value => `${value}gwei`,
    color: () => 'info',
  },
  {
    type: 'small',
    title: 'Gas Limit',
    icon: 'money',
    accessor: ({block}) => block.gasLimit,
    show: value => `${value}gas`,
    color: () => 'info',
  },
  {
    type: 'small',
    title: 'Epoch size',
    icon: 'archive',
    accessor: ({block}) => block.epochSize,
    color: () => 'warn1',
  },
  {
    type: 'small',
    title: 'Registered validators',
    icon: 'check',
    accessor: ({block}) => block.validators.registered,
    color: () => 'ok',
  },
]
