import { Injectable } from '@angular/core'
import { Store, select, Action } from '@ngrx/store'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import {  } from 'rxjs/operators'

@Injectable()
export class SettingsEffects {
  constructor(private actions$: Actions) {}
}
