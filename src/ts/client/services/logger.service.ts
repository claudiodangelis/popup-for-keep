import { Injectable } from '@angular/core'
import { Logger, Log } from '../../common/logger'

@Injectable()
export class LoggerService {
    getLogs(): Promise<Log[]> {
        return new Promise(resolve => {
            const l = new Logger()
            resolve(l.all)
        })
    }
    clearLogs(): Promise<void> {
        return new Promise(resolve => {
            const l = new Logger()
            l.clear()
            resolve()
        })
    }
    constructor() {}
}
