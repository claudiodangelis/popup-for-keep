import { Injectable } from '@angular/core'
import { Settings, LoadSettings } from '../../common/settings'

@Injectable()
export class SettingsService {
    getSettings(): Promise<Settings> { return LoadSettings() }
    forceAccountDiscovery(): Promise<Settings> { return LoadSettings({forceDiscovery: true}) }
    constructor() {}
}
