import { Component, OnInit } from '@angular/core'
import { SwUpdate } from '@angular/service-worker';

import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  submenu = environment.submenu
  menu = environment.menu
  hasUpdates = false
  canBeInstalled = false
  isInstalled = false

  private installablePrompt: any

  constructor(private swUpdate: SwUpdate) { }

  ngOnInit() {
    // Install
    window.addEventListener('beforeinstallprompt', prompt => {
      prompt.preventDefault()

      this.canBeInstalled = true
      this.installablePrompt = prompt
    })
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true
    })

    // Update
    if (this.swUpdate.isEnabled) {
      setInterval(() => this.swUpdate.checkForUpdate(), 5 * 60 * 1000)
      this.swUpdate.available.subscribe(() => {
        this.hasUpdates = true
      })
    }
  }

  update() {
    window.location.reload()
  }

  async install() {
    this.canBeInstalled = false
    this.installablePrompt.prompt()

    const choice = await this.installablePrompt.deferredPrompt.userChoice
  }
}
