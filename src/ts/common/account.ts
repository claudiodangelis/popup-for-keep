import { Logger } from './logger'

export class Account {
    index: number
    user: string = 'unknown'
    email: string = 'unknown'
    imageSrc: string = null

    constructor() {

    }
}

function createAccountFromFragment(html: string, index: number): Promise<Account> {
    let account = new Account()
    account.index = index
    return new Promise(resolve => {
        let parser = new DOMParser()
        let doc = parser.parseFromString(html, 'text/html')
        // This is for debug purposes only
        if (doc.documentElement.innerHTML) {
            let debugEmailMatches = doc.documentElement.innerHTML.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
            if (debugEmailMatches !== null) {
                debugEmailMatches.forEach(email => {
                    l.debug('discovery', `email found in the raw document: ${email}`)
                })
            }
        }
        let infoNode = doc.querySelector(
            '[href^="https://accounts.google.com/SignOutOptions"')
        if (infoNode === null) {
            l.error('discovery', 'info node is null')
        } else {
            l.info('discovery', `parsing info: ${infoNode.innerHTML}`)
        }
        let info = infoNode.getAttribute('aria-label')
        // If info is null it means that the account is a Google Suite account
        if (info === null) {
            // Check if there is the element we're looking for
            let node = infoNode.querySelector('a[aria-label*="Google Account"], a[aria-label*="google-account"]')
            if (node) {
                info = node.getAttribute('aria-label')
            }
        }
        account.user = info
        l.info('discovery', `parsing email from: ${info}`)
        let emailMatches = info.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
        if (emailMatches.length > 0) {
            account.email = emailMatches[0]
        }
        var imageNode = doc.querySelector(`a[href$="?authuser=${index}"] > img`)
        if (imageNode !== null) {
            account.imageSrc = imageNode.getAttribute('data-src')
        }
        resolve(account)
    })
}

const l = new Logger()

export function DiscoverAccounts(): Promise<Account[]> {
    let accounts: Account[] = []
    return new Promise((resolve, reject) => {
        let index = 0
        let next = () => {
            console.debug('looking for...')
            l.info('discover-accounts', `discovering account: ${index}`)
            let xhr = new XMLHttpRequest()
            xhr.open('get', `https://keep.google.com/u/${index}/`, true)
            xhr.onerror = err => {
                console.error('err', JSON.stringify(err))
                l.error('discover-accounts', JSON.stringify(err))
                return resolve(accounts)
            }
            xhr.onreadystatechange = () => {
                console.debug('status:', xhr.status)
                if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                    if (xhr.responseURL.split('/')[4] === index.toString()) {
                        // Found
                        createAccountFromFragment(xhr.responseText, index).then(account => {
                            accounts.push(account)
                            index++
                            next()
                        }).catch((err) => {
                            console.debug('err', err)
                            index++
                            next()
                        })
                    } else {
                        l.info('discover-accounts', `completed, found: ${accounts.length}`)
                        resolve(accounts)
                    }
                }
            }
            xhr.send()
        }
        next()
    })
}
