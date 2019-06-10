// TODO: There is some duplicate code that can be wrapped together
const DOM = {
    mainWrapper: 'div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    textWrapper: 'div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    titleNode: 'div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf:not(.LwH6nd)',
    textNode: 'div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf:not(.LwH6nd)',
    titleWrapper: 'div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf.LwH6nd'
}

const isIdle = () => {
    // If google keep "is idle", meaning that the user is not doing anything
    // like viewing or editing a node, then we can programmatically create the
    return new Promise(resolve => {
        resolve(document.querySelector(DOM.textNode) === null)
    })
}

const createNote = (note) => {
    return new Promise((resolve, reject) => {
        // Expand the box
        const mainWrapper = document.querySelector(DOM.mainWrapper) as HTMLElement
        if (mainWrapper === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'main wrapper not found'
            })
        }
        mainWrapper.click()

        // Hide the placeholders
        const textWrapper = document.querySelector(DOM.textWrapper) as HTMLElement
        if (textWrapper === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'text wrapper not found'
            })
        }
        textWrapper.textContent = ''

        // Populate the actual fields
        const titleNode = document.querySelector(DOM.titleNode) as HTMLElement
        if (titleNode === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'title node not found'
            })
        }
        titleNode.click()
        titleNode.textContent = note.title

        const textNode = document.querySelector(DOM.textNode) as HTMLElement
        if (textNode === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'text node not found'
            })
        }
        textNode.textContent = note.text
        textNode.click()
        titleNode.focus()

        const titleWrapper = document.querySelector(DOM.titleWrapper) as HTMLElement
        if (titleWrapper === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'title wrapper not found'
            })
        }
        titleWrapper.textContent = ''
        titleNode.blur()
        resolve({
            status: 'done',
            success: true
        })
    })
}

chrome.runtime.onMessage.addListener((body, _, sendResponse) => {
    if (body.command === 'is-idle') {
        isIdle().then(sendResponse).catch(() => {
            sendResponse(false)
        })
    } else if (body.command === 'create-note') {
        createNote(body.argument).then(sendResponse).catch(err => {
            console.error(err)
            sendResponse(false)
        })
    }
    return true
})
