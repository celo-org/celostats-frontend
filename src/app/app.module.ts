import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { PROVIDERS } from './shared'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    ...PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
