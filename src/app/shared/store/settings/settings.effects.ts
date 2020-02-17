import { Injectable } from '@angular/core'
import { Store, select, Action } from '@ngrx/store'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { map, filter, withLatestFrom } from 'rxjs/operators'

import { State as Settings, AppState } from './settings.state'
import * as fromSettings from './settings.reducers'
import * as settingsActions from './settings.actions'

const SETTINGS_KEY = 'app-settings'

@Injectable()
export class SettingsEffects {

  loadSettings$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => this.getSettings()),
    filter(_ => !!_),
    map(settings => settingsActions.setSettings({settings})),
  ))

  writeSettings$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.pinNode),
    withLatestFrom(
      this.store.pipe(
        select(fromSettings.select),
      ),
    ),
    map(([, settings]) => this.setSettings(settings))
  ), {dispatch: false})

  constructor(private actions$: Actions, private store: Store<AppState>) { }

  getSettings(): Settings {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY))
  }

  setSettings(settings: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }
}
