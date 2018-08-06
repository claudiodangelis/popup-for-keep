import { Component, Inject } from '@angular/core'
import { SettingsService } from '../client/services/settings.service'
import { LoggerService } from '../client/services/logger.service'
import { Settings, DefaultIcons } from '../common/settings'
import { Log } from '../common/logger'
import { BrowserModule } from '@angular/platform-browser'

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html'
})
export class OptionsComponent {
    title = 'Options Page'
    settings: Settings
    logs: string = ''
    constructor(
        @Inject(SettingsService) private settingsService: SettingsService,
        @Inject(LoggerService) private loggerService: LoggerService
    ) {}

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
        this.loggerService.getLogs().then(logs => {
            logs.forEach(log => {
                this.logs += `${log.timestamp} [${log.level}] [${log.tag}]${log.message}\n`
            })
        })
    }

    looking = false
    lookForGoogleAccountsError: string = null
    lookForGoogleAccounts() {
        this.looking = true
        this.settingsService.forceAccountDiscovery().then(settings => {
            this.settings = settings
            this.lookForGoogleAccountsError = null
            this.looking = false
        }).catch(() => {
            this.lookForGoogleAccountsError = 'Unable to find available Google accounts at this time.'
            this.looking = false
        })
    }
    logsOpen = false
    toggleLogs() {
        this.logsOpen = !this.logsOpen
    }
    clearLogs() {
        this.loggerService.clearLogs().then(() => {}).catch(() => {})
        this.refreshLogs()
    }
    refreshLogs() {
        // TODO: remove duplicate code
        this.logs = ''
        this.loggerService.getLogs().then(logs => {
            logs.forEach(log => {
                this.logs += `${log.timestamp} [${log.level}] [${log.tag}] ${log.message}\n`
            })
            this.logsOpen = true
        })
    }
    sendLogs() {
        let message = `This is a generated message
Date: ${new Date().toISOString()}

`
        message += this.logs
        window.open(`mailto:claudiodangelis@gmail.com?subject=${encodeURIComponent('Popup For Keep - Logs')}&body=${encodeURIComponent(message)}`)
    }
}
