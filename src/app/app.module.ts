import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { environment } from '../environments/environment'

import { AppComponent } from './app.component'

import { PROVIDERS } from './shared'
import { reducers, metaReducers, effects } from './shared/store'

import { DASHBOARD_COMPONENTS } from './+dashboard'

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
    // StoreDevtoolsModule.instrument({ maxAge: 5, logOnly: environment.production }),
    EffectsModule.forRoot(effects),
    BrowserAnimationsModule,

    MatIconModule,
    MatTooltipModule,

    InfoModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
