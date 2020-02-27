import { Component, OnInit } from '@angular/core'

import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  submenu = environment.submenu
  canBeInstalled = false

  private installablePrompt: any

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', prompt => {
      prompt.preventDefault()

      this.canBeInstalled = true
      this.installablePrompt = prompt
    })
  }

  async install() {
    this.canBeInstalled = false
    this.installablePrompt.prompt()

    const choice = await this.installablePrompt.deferredPrompt.userChoice
  }
}
