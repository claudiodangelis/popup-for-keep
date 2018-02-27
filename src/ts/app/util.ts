const createKeepTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise(resolve => {
        console.debug('about to create a new tab')
        chrome.tabs.create({
            url: 'https://keep.google.com'
        }, tab => {
            // poll
            const poll = () => {
                if (tab.status === 'complete') {
                    return resolve(tab)
                }
                setTimeout(poll, 500)
            }
            poll()
        })
    })
}

export const getIdleTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise((resolve, reject) => {
        console.debug('requesting tabs with google keep')
        chrome.tabs.query({
            status: 'complete', url: `https://keep.google.com/*`
        }, tabs => {
            console.debug('found these google keep tabs', tabs)
            if (tabs.length === 0) {
                return createKeepTab().then(resolve).catch(reject)
            }
            console.debug('checking if the tab is idle')
            const checked = []
            tabs.forEach(tab => {
                console.debug('sending a message to tab', tab.id)
                chrome.tabs.sendMessage(tab.id, {
                    command: 'is-idle'
                }, response => {
                    console.debug(`tab ${tab.id} replied: ${response}`)
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
                        console.debug('we reached the end of tabs')
                        // Yes, we need to create a new one
                        return createKeepTab().then(resolve).catch(reject)
                    }
                })
            })
        })
    })
}
