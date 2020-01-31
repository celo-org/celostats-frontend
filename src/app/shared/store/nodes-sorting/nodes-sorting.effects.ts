import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { map } from 'rxjs/operators'

import { columns } from './columns.data'
import * as nodesSortingActions from './nodes-sorting.actions'

@Injectable()
export class NodesSortingEffects {

  setColumns$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => nodesSortingActions.setColumns({columns})),
  ))

  constructor(private actions$: Actions) {}
}
