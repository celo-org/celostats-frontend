import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';

@Injectable()
export class EthstatsEffects {
  constructor(private actions$: Actions) {}
}
