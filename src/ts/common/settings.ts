import { Account, DiscoverAccounts } from './account'

export interface Icon {
    path: string
    name: string
}

export var DefaultIcons: Icon[] = [
    {
        name: 'Color',
        path: 'img/icon-32.png'
    },
    {
        name: 'Monochrome',
        path: 'img/mono-icon-32.png'
    }
]

export class Settings {
    icon: string = DefaultIcons[0].path
    lastUsedAccount: number = 0
    accounts: Account[] = []
    construct() {}
    fromObject(object) {
        if (typeof object.icon !== 'undefined') {
            this.icon = object.icon
        }
        if (typeof object.lastUsedAccount !== 'undefined') {
            this.lastUsedAccount = object.lastUsedAccount
        }
        if (typeof object.accounts !== 'undefined') {
            this.accounts = object.accounts
        }
    }
    save(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            chrome.storage.sync.set({settings: this}, () => {
                resolve(typeof chrome.runtime.lastError === 'undefined')
            })
        })
    }
}

function legacySettingsAdapter(object: any) : Settings {
    // Do something with object
    return new Settings()
}

export function LoadSettings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('settings', (storage) => {
            let settings = new Settings()
            if (typeof storage.settings !== 'undefined') {
                settings.fromObject(storage.settings)
            }
            if (settings.accounts.length === 0) {
                DiscoverAccounts().then((accounts: Account[]) => {
                    if (accounts.length === 0) {
                        return reject('no accounts found')
                    }
                    settings.accounts = accounts
                    settings.lastUsedAccount = 0
                    resolve(settings)
                    settings.save()
                }).catch(reject)
            } else {
                // More than one account
                if (typeof settings.lastUsedAccount === 'undefined') {
                    settings.lastUsedAccount = 0
                }
                resolve(settings)
                settings.save()
            }
        })
    })
}
