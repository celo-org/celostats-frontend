import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServiceWorkerModule } from '@angular/service-worker'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DragScrollModule } from 'ngx-drag-scroll'

import { environment } from '../environments/environment'

import { AppComponent } from './app.component'

import { GraphQLModule } from './graphql.module'
import { PROVIDERS } from './shared'
import { reducers, metaReducers, effects } from './shared/store'

import { DASHBOARD_COMPONENTS } from './+dashboard'

import { BlockProposersModule } from './components/block-proposers'
import { ChartModule } from './components/chart'
import { InfoModule } from './components/info'
import { MicroChartModule } from './components/micro-chart'

@NgModule({
  declarations: [
    AppComponent,
    ...DASHBOARD_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWithDelay:10000',
    }),
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

    GraphQLModule,

    DragScrollModule,

    MatIconModule,
    MatRippleModule,
    MatTooltipModule,

    BlockProposersModule,
    ChartModule,
    InfoModule,
    MicroChartModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
