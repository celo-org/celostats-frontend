import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DragScrollModule } from 'ngx-drag-scroll';

import { environment } from '../environments/environment'

import { AppComponent } from './app.component'

import { PROVIDERS } from './shared'
import { reducers, metaReducers, effects } from './shared/store'

import { DASHBOARD_COMPONENTS } from './+dashboard'

import { BlockProposersModule } from './components/block-proposers'
import { ChartModule } from './components/chart'
import { InfoModule } from './components/info'

@NgModule({
  declarations: [
    AppComponent,
    ...DASHBOARD_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    // ...(!environment.production ? [StoreDevtoolsModule.instrument({maxAge: 5})] : []),
    EffectsModule.forRoot(effects),
    BrowserAnimationsModule,

    DragScrollModule,

    MatIconModule,
    MatRippleModule,
    MatTooltipModule,

    BlockProposersModule,
    ChartModule,
    InfoModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
