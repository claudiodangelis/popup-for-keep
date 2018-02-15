import { Settings, LoadSettings } from '../common/settings'
import { Account, DiscoverAccounts } from '../common/account'

export class App {
    settings: Settings
    accounts: Account[]

    construct() {
        this.settings = new Settings()
    }

    configure(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            LoadSettings().then(settings => {
                this.settings = settings
            }).then(() => {
                resolve(true)
            }).catch(reject)
        })
    }
}
