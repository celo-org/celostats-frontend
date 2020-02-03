import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { map } from 'rxjs/operators'

import * as nodesDataActions from './nodes-data.actions'

@Injectable()
export class NodesDataEffects {

  constructor(private actions$: Actions) {}
}
