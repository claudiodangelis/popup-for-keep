export interface Log {
    tag: string
    level: string
    message: string
    timestamp: string
}

let buffer: Log[] = []
export class Logger {
    get all() {
        return buffer
    }
    private log(level: string, tag: string, msg: string) {
        if (buffer.length >= 10) {
            buffer.shift()
        }
        buffer.push({
            level: level.toUpperCase(),
            message: msg,
            tag: tag.toUpperCase(),
            timestamp: new Date().toISOString()
        })
        chrome.storage.sync.set({logs: buffer}, () => {
            if (chrome.runtime.lastError) {
                if (chrome.runtime.lastError.message === 'QUOTA_BYTES_PER_ITEM quota exceeded') {
                    chrome.storage.sync.set({
                        logs: [],
                    }, () => {})
                } else {
                    console.error('caught error:', chrome.runtime.lastError)
                }
            }
        })
    }
    clear() {
        buffer = []
        chrome.storage.sync.remove('logs', () => {})
    }
    info(tag: string, msg: string) {
        this.log('info', tag, msg)
    }
    debug(tag: string, msg: string) {
        this.log('debug', tag, msg)
    }
    error(tag: string, msg: string) {
        this.log('error', tag, msg)
    }
    constructor() {
        if (buffer.length === 0) {
            chrome.storage.sync.get('logs', storage => {
                if (typeof storage.logs === 'undefined') {
                    return buffer = []
                }
                if (!storage.logs.length) {
                    return buffer = []
                }
                storage.logs.reverse().forEach(log => {
                    if (typeof log.tag !== 'string') {
                        return
                    }
                    if (typeof log.message !== 'string') {
                        return
                    }
                    if (typeof log.level !== 'string') {
                        return
                    }
                    if (typeof log.timestamp !== 'string') {
                        return
                    }
                    buffer.push(log)
                })
            })
        }
    }
}
