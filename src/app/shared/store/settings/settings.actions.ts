import { createAction, props } from '@ngrx/store'
import { State } from './settings.state'

export const setSettings = createAction('[Settings] Set settings', props<{settings: State}>())
