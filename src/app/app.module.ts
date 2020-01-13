import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { AppComponent } from './app.component'

import { PROVIDERS } from './shared'
import { reducers, metaReducers, effects } from './shared/store'

import { environment } from '../environments/environment';
import { DASHBOARD_COMPONENTS } from './+dashboard';

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
    BrowserAnimationsModule
  ],
  providers: [
    ...PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
