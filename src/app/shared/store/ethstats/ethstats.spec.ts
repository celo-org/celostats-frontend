import { reduceActions } from '../testing-utils'

import { EthstatsNode } from './ethstats.state'
import * as fromEthstats from './ethstats.reducers'
import * as ethstatesActions from './ethstats.actions'
import { BlockSummary } from '@celo/celostats-server'

const reducer = fromEthstats.reducer

describe('Ethstats Store reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(reducer)
    expect(finalState).not.toBeUndefined()
  })

  it('should add nodes', () => {
    const finalState = reduceActions(reducer, [
      ethstatesActions.updateNodes({nodes: [{id: '0x0'}] as unknown as EthstatsNode[]}),
    ])
    expect(fromEthstats.getNodes(finalState)).toEqual({'0x0': {id: '0x0', updates: 1} as unknown as EthstatsNode})
  })

  it('should add multiples nodes and not repeat them', () => {
    const states = reduceActions(reducer, [
      ethstatesActions.updateNodes({nodes: [{id: '0x0'}] as unknown as EthstatsNode[]}),
      ethstatesActions.updateNodes({nodes: [{id: '0x0'}, {id: '0x1'}] as unknown as EthstatsNode[]}),
      ethstatesActions.updateNodes({nodes: [{id: '0x1'}, {id: '0x2'}] as unknown as EthstatsNode[]}),
    ], true)

    const finalState = states[states.length - 1]

    const nodesLength = states
      .map(fromEthstats.getNodesList)
      .map(({length}) => length)

    expect(fromEthstats.getNodes(finalState)).toEqual({
      '0x0': {id: '0x0', updates: 2} as unknown as EthstatsNode,
      '0x1': {id: '0x1', updates: 2} as unknown as EthstatsNode,
      '0x2': {id: '0x2', updates: 1} as unknown as EthstatsNode,
    })

    expect(nodesLength).toEqual([0, 1, 2, 3])
  })

  it('should update a node', () => {
    const states = reduceActions(reducer, [
      ethstatesActions.updateNodes({nodes: [{id: '0x0', stats: {propagationAvg: 10}}] as unknown as EthstatsNode[]}),
      ethstatesActions.updateNodes({nodes: [{id: '0x0', stats: {propagationAvg: 20}}] as unknown as EthstatsNode[]}),
    ], true)

    const nodePropagationAvg = states
      .map(fromEthstats.getNodesList)
      .map(nodes => nodes[0]?.stats?.propagationAvg)

    expect(nodePropagationAvg).toEqual([undefined, 10, 20])
  })

  it('should set the last block', () => {
    const finalState = reduceActions(reducer, [
      ethstatesActions.setLastBlock({block: {number: 1} as BlockSummary}),
      ethstatesActions.setLastBlock({block: {number: 2} as BlockSummary}),
      ethstatesActions.setLastBlock({block: {number: 1} as BlockSummary}),
    ])

    expect(fromEthstats.getLastBlock(finalState)).toEqual({number: 2} as BlockSummary)
  })

  it('should set last charts data', () => {
    const finalState = reduceActions(reducer, [
      ethstatesActions.updateCharts({charts: {test: 1} as any}),
      ethstatesActions.updateCharts({charts: {test: 2} as any}),
      ethstatesActions.updateCharts({charts: {test: 3} as any}),
    ])

    expect(fromEthstats.getChars(finalState)).toEqual({test: 3, updates: 3} as any)
  })
})
