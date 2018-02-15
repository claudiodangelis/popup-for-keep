const path = require('path')

module.exports = {
    entry: {
        background: [
            path.join(__dirname, 'src/ts/common/account.ts'),
            path.join(__dirname, 'src/ts/common/settings.ts'),
            path.join(__dirname, 'src/ts/app/app.ts'),
            path.join(__dirname, 'src/ts/app/background.ts')
        ],
        popup: [
            path.join(__dirname, 'src/ts/common/settings.ts'),
            path.join(__dirname, 'src/ts/client/main.ts'),
            path.join(__dirname, 'src/ts/client/module.ts'),
            path.join(__dirname, 'src/ts/client/services/settings.service.ts'),
            path.join(__dirname, 'src/ts/client/components/popup.component.ts')
        ]
    },
    output: {
        path: path.join(__dirname, 'src/js'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
    ]
}
