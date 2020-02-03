import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { map } from 'rxjs/operators'

import { columns } from './columns.data'
import * as nodesSortingActions from './nodes-sorting.actions'

@Injectable()
export class NodesSortingEffects {

  setColumns$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => nodesSortingActions.setColumns({
      columns: columns
        .map(column => ({
          ...column,
          accessor: node => column.accessor(node) ?? '',
          link: (value, context) => column.link?.(value, context) || undefined,
          show: (value, context) => column.show?.(value, context) ?? value,
          color: (value, context) =>
            column.color?.(value, context)
            || (context?.node?.stats?.active ? 'ok' : 'no'),
        }))
    })),
  ))

  constructor(private actions$: Actions) {}
}
