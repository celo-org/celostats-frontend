import { reduceActions } from '../testing-utils'

import { Node, ValidatorGroup } from './raw-data.state'
import * as fromRawData from './raw-data.reducers'
import * as rawDataActions from './raw-data.actions'
import { BlockSummary } from '@celo/celostats-server'

const reducer = fromRawData.reducer

describe('RawData Store reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(reducer)
    expect(finalState).not.toBeUndefined()
  })

  it('should add nodes', () => {
    const finalState = reduceActions(reducer, [
      rawDataActions.updateNodes({nodes: [{id: '0x0'}] as unknown as Node[]}),
    ])
    expect(fromRawData.getNodes(finalState)).toEqual({'0x0': {id: '0x0', updates: 1} as unknown as Node})
  })

  it('should add multiples nodes and not repeat them', () => {
    const states = reduceActions(reducer, [
      rawDataActions.updateNodes({nodes: [{id: '0x0'}] as unknown as Node[]}),
      rawDataActions.updateNodes({nodes: [{id: '0x0'}, {id: '0x1'}] as unknown as Node[]}),
      rawDataActions.updateNodes({nodes: [{id: '0x1'}, {id: '0x2'}] as unknown as Node[]}),
    ], true)

    const finalState = states[states.length - 1]

    const nodesLength = states
      .map(fromRawData.getNodesList)
      .map(({length}) => length)

    expect(fromRawData.getNodes(finalState)).toEqual({
      '0x0': {id: '0x0', updates: 2} as unknown as Node,
      '0x1': {id: '0x1', updates: 2} as unknown as Node,
      '0x2': {id: '0x2', updates: 1} as unknown as Node,
    })

    expect(nodesLength).toEqual([0, 1, 2, 3])
  })

  it('should update a node', () => {
    const states = reduceActions(reducer, [
      rawDataActions.updateNodes({nodes: [{id: '0x0', stats: {propagationAvg: 10}}] as unknown as Node[]}),
      rawDataActions.updateNodes({nodes: [{id: '0x0', stats: {propagationAvg: 20}}] as unknown as Node[]}),
    ], true)

    const nodePropagationAvg = states
      .map(fromRawData.getNodesList)
      .map(nodes => nodes[0]?.stats?.propagationAvg)

    expect(nodePropagationAvg).toEqual([undefined, 10, 20])
  })

  it('should set the last block', () => {
    const finalState = reduceActions(reducer, [
      rawDataActions.setLastBlock({block: {number: 1} as BlockSummary}),
      rawDataActions.setLastBlock({block: {number: 2} as BlockSummary}),
      rawDataActions.setLastBlock({block: {number: 1} as BlockSummary}),
    ])

    expect(fromRawData.getLastBlock(finalState)).toEqual({number: 2} as BlockSummary)
  })

  it('should set last charts data', () => {
    const finalState = reduceActions(reducer, [
      rawDataActions.updateCharts({charts: {test: 1} as any}),
      rawDataActions.updateCharts({charts: {test: 2} as any}),
      rawDataActions.updateCharts({charts: {test: 3} as any}),
    ])

    expect(fromRawData.getChars(finalState)).toEqual({test: 3, updates: 3} as any)
  })

  it('should add validator groups', () => {
    const finalState = reduceActions(reducer, [
      rawDataActions.updateValidatorGroups({groups: [{address: '0x0'}] as unknown as ValidatorGroup[]}),
    ])
    console.log(fromRawData.getValidatorsGroups(finalState))
    expect(fromRawData.getValidatorsGroups(finalState)).toEqual({'0x0': {address: '0x0'} as unknown as ValidatorGroup})
  })
})
