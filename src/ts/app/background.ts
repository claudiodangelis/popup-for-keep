import { App } from './app'
let app = new App()

app.configure()
    .then(configured => {
        if (!configured) {
            console.warn('no accounts have been found')
        }
    })
