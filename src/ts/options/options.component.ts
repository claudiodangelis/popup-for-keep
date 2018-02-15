import { Component, Inject } from '@angular/core'
import { SettingsService } from '../client/services/settings.service'
import { Settings, DefaultIcons } from '../common/settings'
import { BrowserModule } from '@angular/platform-browser'

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html'
})
export class OptionsComponent {
    title = 'Options Page'
    settings: Settings
    constructor(@Inject(SettingsService) private settingsService: SettingsService) {}

    chooseAccount(accountIndex) {
        this.settings.lastUsedAccount = accountIndex
        this.settings.save()
    }

    chooseIcon(iconIndex) {
        this.settings.icon = DefaultIcons[iconIndex].path
        chrome.browserAction.setIcon({
            path: this.settings.icon
        })
        this.settings.save()
    }

    ngOnInit() {
        this.settingsService.getSettings().then(settings => {
            this.settings = settings
        })
    }

}
