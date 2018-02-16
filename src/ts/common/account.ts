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
        let infoNode = doc.querySelector(
            '[href^="https://accounts.google.com/SignOutOptions"')
        let info = infoNode.getAttribute('aria-label')
        account.user = info
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


export function DiscoverAccounts(): Promise<Account[]> {
    let accounts: Account[] = []
    return new Promise((resolve, reject) => {
        let index = 0
        let next = () => {
            let xhr = new XMLHttpRequest()
            xhr.open('get', `https://keep.google.com/u/${index}/`, true)
            xhr.onerror = reject
            xhr.onreadystatechange = () => {
                if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                    if (xhr.responseURL.split('/')[4] === index.toString()) {
                        // Found
                        createAccountFromFragment(xhr.responseText, index).then(account => {
                            accounts.push(account)
                            index++
                            next()
                        }).catch((err) => {
                            index++
                            next()
                        })
                    } else{
                        resolve(accounts)
                    }
                }
            }
            xhr.send()
        }
        next()
    })
}
