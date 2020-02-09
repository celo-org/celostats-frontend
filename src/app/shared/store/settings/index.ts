export * from './settings.state'
export * from './settings.reducers'
export { SettingsEffects as Effects } from './settings.effects'

import * as _actions from './settings.actions'
export const actions = _actions
