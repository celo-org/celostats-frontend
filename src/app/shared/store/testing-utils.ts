import { Action, INIT } from '@ngrx/store'

export function reduceActions<T>(reducer: (T, Action) => T, actions?: Action[], returnSteps?: false): T
export function reduceActions<T>(reducer: (T, Action) => T, actions: Action[], returnSteps: true): T[]
export function reduceActions<T>(reducer: (T, Action) => T, actions: Action[] = [], returnSteps: boolean = false): T | T[] {
  const steps = []
  const finalState = [
      {type: INIT},
      ...actions,
    ]
    .reduce((state, action) => {
      const nextState = reducer(state, action)
      steps.push({...(nextState as any), $action: action})
      return nextState
    }, undefined as any)
  return returnSteps ? steps : finalState
}
