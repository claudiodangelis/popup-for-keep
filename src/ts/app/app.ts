import { Settings, LoadSettings } from '../common/settings'
import { Account, DiscoverAccounts } from '../common/account'
import { getIdleTab } from './util'

export class App {
    settings: Settings
    accounts: Account[]

    construct() {
        this.settings = new Settings()
    }

    get userIndex() {
        return this.settings.lastUsedAccount
    }

    configure(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            LoadSettings().then(settings => {
                this.settings = settings
                // Set icon
                chrome.browserAction.setIcon({
                    path: this.settings.icon
                })
            }).then(() => {
                resolve(true)
            }).catch(reject)
            // Add to keep
            ;['page', 'selection', 'link'].forEach(context => {
                chrome.contextMenus.create({
                    title: `Add ${context} to Google Keep`,
                    contexts: [ context ],
                    onclick: (info, tab) => {
                        let firedOnce = false
                        const title = tab.title
                        let text = tab.url
                        if (typeof info.selectionText !== 'undefined') {
                            text = `${info.selectionText}\n\n${tab.url}`
                        }
                        getIdleTab().then(tab => {
                            chrome.tabs.sendMessage(tab.id, {
                                command: 'create-note',
                                argument: {
                                    title: title, text: text
                                }
                            })
                        }).catch(err => {
                            console.error('error while getting a keep tab', err)
                        })
                    }
                })
            })
            // Populate some more menus
            chrome.contextMenus.create({
                title: 'Open Google Keep',
                contexts: ['browser_action'],
                onclick: _ => {
                    let found = false
                    chrome.tabs.query({
                        url: 'https://keep.google.com/*'
                    }, tabs => {
                        if (tabs.length > 0) {
                            return chrome.tabs.update(tabs[0].id, {active: true})
                        }
                        chrome.tabs.create({
                            url: `https://keep.google.com/u/${this.userIndex}`
                        })
                    })
                }
            })
            chrome.contextMenus.create({
                title: 'Open Google Keep in a floating popup',
                contexts: ['browser_action'],
                onclick: _ => {
                    chrome.windows.create({
                        url: `https://keep.google.com/u/${this.userIndex}`,
                        width: 500,
                        height: 500,
                        focused: true,
                        type: 'popup'
                    })
                }
            })
            // Discover accounts every 6 hours
            const discover = () => {
                DiscoverAccounts().then(accounts => {
                    this.settings.accounts = accounts
                    this.settings.save().then(() => {
                        setTimeout(discover, 6 * 60 * 60 * 1000)
                    })
                }).catch((error) => {
                    console.error(error)
                })
            }
            setTimeout(discover, 6 * 60 * 60 * 1000)
        })
    }
}
