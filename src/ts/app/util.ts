const createKeepTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise(resolve => {
        chrome.tabs.create({
            url: 'https://keep.google.com'
        }, keepTab => {
            // poll
            const poll = () => {
                chrome.tabs.get(keepTab.id, tab => {
                    if (tab.status === 'complete') {
                        return resolve(tab)
                    }
                    setTimeout(poll, 500)
                })
            }
            poll()
        })
    })
}

export const getIdleTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            status: 'complete', url: `https://keep.google.com/*`
        }, tabs => {
            if (tabs.length === 0) {
                return createKeepTab().then(resolve).catch(reject)
            }
            const checked = []
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    command: 'is-idle'
                }, response => {
                    checked.push(tab.id)
                    if (response === true) {
                        // Note: if more than one tab is idle the line below
                        // will be called multiple times, but it's not a
                        // real problem because once this promise has
                        // resolved, subsequent calls to `resolve() will be
                        // ignored
                        return resolve(tab)
                    }
                    // Is this the last open tab we are checking?
                    if (checked.length === tabs.length) {
                        // Yes, we need to create a new one
                        return createKeepTab().then(resolve).catch(reject)
                    }
                })
            })
        })
    })
}
