/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 58);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let buffer = [];
class Logger {
    get all() {
        return buffer;
    }
    log(level, tag, msg) {
        if (buffer.length >= 10) {
            buffer.shift();
        }
        buffer.push({
            level: level.toUpperCase(),
            message: msg,
            tag: tag.toUpperCase(),
            timestamp: new Date().toISOString()
        });
        chrome.storage.sync.set({ logs: buffer }, () => {
            if (chrome.runtime.lastError) {
                if (chrome.runtime.lastError.message === 'QUOTA_BYTES_PER_ITEM quota exceeded') {
                    chrome.storage.sync.set({
                        logs: [],
                    }, () => { });
                }
                else {
                    console.error('caught error:', chrome.runtime.lastError);
                }
            }
        });
    }
    clear() {
        buffer = [];
        chrome.storage.sync.remove('logs', () => { });
    }
    info(tag, msg) {
        console.info(tag, msg);
        this.log('info', tag, msg);
    }
    debug(tag, msg) {
        console.debug(tag, msg);
        this.log('debug', tag, msg);
    }
    error(tag, msg) {
        console.error(tag, msg);
        this.log('error', tag, msg);
    }
    constructor() {
        if (buffer.length === 0) {
            chrome.storage.sync.get('logs', storage => {
                if (typeof storage.logs === 'undefined') {
                    return buffer = [];
                }
                if (!storage.logs.length) {
                    return buffer = [];
                }
                storage.logs.reverse().forEach(log => {
                    if (typeof log.tag !== 'string') {
                        return;
                    }
                    if (typeof log.message !== 'string') {
                        return;
                    }
                    if (typeof log.level !== 'string') {
                        return;
                    }
                    if (typeof log.timestamp !== 'string') {
                        return;
                    }
                    buffer.push(log);
                });
            });
        }
    }
}
exports.Logger = Logger;


/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const createKeepTab = () => {
    return new Promise(resolve => {
        chrome.tabs.create({
            url: 'https://keep.google.com'
        }, keepTab => {
            // poll
            const poll = () => {
                chrome.tabs.get(keepTab.id, tab => {
                    if (tab.status === 'complete') {
                        return resolve(tab);
                    }
                    setTimeout(poll, 500);
                });
            };
            poll();
        });
    });
};
exports.getIdleTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            status: 'complete', url: `https://keep.google.com/*`
        }, tabs => {
            if (tabs.length === 0) {
                return createKeepTab().then(resolve).catch(reject);
            }
            const checked = [];
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    command: 'is-idle'
                }, response => {
                    checked.push(tab.id);
                    if (response === true) {
                        // Note: if more than one tab is idle the line below
                        // will be called multiple times, but it's not a
                        // real problem because once this promise has
                        // resolved, subsequent calls to `resolve() will be
                        // ignored
                        return resolve(tab);
                    }
                    // Is this the last open tab we are checking?
                    if (checked.length === tabs.length) {
                        // Yes, we need to create a new one
                        return createKeepTab().then(resolve).catch(reject);
                    }
                });
            });
        });
    });
};


/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __webpack_require__(6);
const account_1 = __webpack_require__(7);
const util_1 = __webpack_require__(51);
class App {
    construct() {
        this.settings = new settings_1.Settings();
    }
    get userIndex() {
        return this.settings.lastUsedAccount;
    }
    configure() {
        return new Promise((resolve, reject) => {
            settings_1.LoadSettings().then(settings => {
                this.settings = settings;
                // Set icon
                chrome.browserAction.setIcon({
                    path: this.settings.icon
                });
            }).then(() => {
                resolve(true);
            }).catch(reject);
            ['page', 'selection', 'link'].forEach(context => {
                chrome.contextMenus.create({
                    title: `Add ${context} to Google Keep`,
                    contexts: [context],
                    onclick: (info, tab) => {
                        let firedOnce = false;
                        const title = tab.title;
                        let text = tab.url;
                        if (typeof info.selectionText !== 'undefined') {
                            text = `${info.selectionText}\n\n${tab.url}`;
                        }
                        util_1.getIdleTab().then(tab => {
                            chrome.tabs.sendMessage(tab.id, {
                                command: 'create-note',
                                argument: {
                                    title: title, text: text
                                }
                            }, () => {
                                chrome.tabs.update(tab.id, { active: true });
                            });
                        }).catch(err => {
                            console.error('error while getting a keep tab', err);
                        });
                    }
                });
            });
            // Populate some more menus
            chrome.contextMenus.create({
                title: 'Open Google Keep',
                contexts: ['browser_action'],
                onclick: _ => {
                    let found = false;
                    chrome.tabs.query({
                        url: 'https://keep.google.com/*'
                    }, tabs => {
                        if (tabs.length > 0) {
                            return chrome.tabs.update(tabs[0].id, { active: true });
                        }
                        chrome.tabs.create({
                            url: `https://keep.google.com/u/${this.userIndex}`
                        });
                    });
                }
            });
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
                    });
                }
            });
            // Discover accounts every 6 hours
            const discover = () => {
                account_1.DiscoverAccounts().then(accounts => {
                    this.settings.accounts = accounts;
                    this.settings.save().then(() => {
                        setTimeout(discover, 6 * 60 * 60 * 1000);
                    });
                }).catch((error) => {
                    console.error(error);
                });
            };
            setTimeout(discover, 6 * 60 * 60 * 1000);
        });
    }
}
exports.App = App;


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
__webpack_require__(6);
__webpack_require__(51);
__webpack_require__(52);
module.exports = __webpack_require__(59);


/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __webpack_require__(52);
let app = new app_1.App();
app.configure()
    .then(configured => {
    if (!configured) {
        console.warn('no accounts have been found');
    }
});


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = __webpack_require__(7);
exports.DefaultIcons = [
    {
        name: 'Color',
        path: 'img/icon-32.png'
    },
    {
        name: 'Monochrome',
        path: 'img/mono-icon-32.png'
    }
];
class Settings {
    constructor() {
        this.icon = exports.DefaultIcons[0].path;
        this.lastUsedAccount = 0;
        this.accounts = [];
    }
    construct() { }
    fromObject(object) {
        if (typeof object.icon !== 'undefined') {
            this.icon = object.icon;
        }
        if (typeof object.lastUsedAccount !== 'undefined') {
            this.lastUsedAccount = object.lastUsedAccount;
        }
        if (typeof object.accounts !== 'undefined') {
            this.accounts = object.accounts;
        }
    }
    save() {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ settings: this }, () => {
                resolve(typeof chrome.runtime.lastError === 'undefined');
            });
        });
    }
}
exports.Settings = Settings;
function legacySettingsAdapter(object) {
    // Do something with object
    return new Settings();
}
function LoadSettings(options) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('settings', (storage) => {
            let settings = new Settings();
            if (typeof storage.settings !== 'undefined') {
                settings.fromObject(storage.settings);
            }
            if (settings.accounts.length === 0 || (typeof options !== 'undefined' && options.forceDiscovery === true)) {
                account_1.DiscoverAccounts().then((accounts) => {
                    if (accounts.length === 0) {
                        return reject('no accounts found');
                    }
                    settings.accounts = accounts;
                    settings.lastUsedAccount = 0;
                    resolve(settings);
                    settings.save();
                }).catch(reject);
            }
            else {
                // More than one account
                if (typeof settings.lastUsedAccount === 'undefined') {
                    settings.lastUsedAccount = 0;
                }
                resolve(settings);
                settings.save();
            }
        });
    });
}
exports.LoadSettings = LoadSettings;


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __webpack_require__(11);
class Account {
    constructor() {
        this.user = 'unknown';
        this.email = 'unknown';
        this.imageSrc = null;
    }
}
exports.Account = Account;
function createAccountFromFragment(html, index) {
    let account = new Account();
    account.index = index;
    return new Promise(resolve => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        // This is for debug purposes only
        if (doc.documentElement.innerHTML) {
            let debugEmailMatches = doc.documentElement.innerHTML.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            if (debugEmailMatches !== null) {
                debugEmailMatches.forEach(email => {
                    l.debug('discovery', `email found in the raw document: ${email}`);
                });
            }
        }
        let infoNode = doc.querySelector('[href^="https://accounts.google.com/SignOutOptions"');
        if (infoNode === null) {
            l.error('discovery', 'info node is null');
        }
        else {
            l.info('discovery', `parsing info: ${infoNode.innerHTML}`);
        }
        let info = infoNode.getAttribute('aria-label');
        // If info is null it means that the account is a Google Suite account
        if (info === null) {
            // Check if there is the element we're looking for
            const selector = 'a.gb_B.gb_Da.gb_g, .gb_D.gb_Oa.gb_i, a[aria-label*="Google Account"], a[aria-label*="Google-account"]';
            let node = infoNode.querySelector(selector);
            if (node !== null) {
                info = node.getAttribute('aria-label');
            }
        }
        account.user = info;
        l.info('discovery', `parsing email from: ${info}`);
        let emailMatches = info.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (emailMatches.length > 0) {
            // TODO: This is a quick fix, URI components should be properly
            // decoded. 
            account.email = emailMatches[0].replace('x22', '');
        }
        var imageNode = doc.querySelector(`a[href$="?authuser=${index}"] > img`);
        if (imageNode !== null) {
            account.imageSrc = imageNode.getAttribute('data-src');
        }
        resolve(account);
    });
}
const l = new logger_1.Logger();
function DiscoverAccounts() {
    let accounts = [];
    return new Promise((resolve, reject) => {
        let index = 0;
        let next = () => {
            console.debug('looking for...');
            l.info('discover-accounts', `discovering account: ${index}`);
            let xhr = new XMLHttpRequest();
            xhr.open('get', `https://keep.google.com/u/${index}/`, true);
            xhr.onerror = err => {
                console.error('err', JSON.stringify(err));
                l.error('discover-accounts', JSON.stringify(err));
                return resolve(accounts);
            };
            xhr.onreadystatechange = () => {
                console.debug('status:', xhr.status);
                if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                    if (xhr.responseURL.split('/')[4] === index.toString()) {
                        // Found
                        createAccountFromFragment(xhr.responseText, index).then(account => {
                            accounts.push(account);
                            index++;
                            next();
                        }).catch((err) => {
                            console.debug('err', err);
                            index++;
                            next();
                        });
                    }
                    else {
                        l.info('discover-accounts', `completed, found: ${accounts.length}`);
                        resolve(accounts);
                    }
                }
            };
            xhr.send();
        };
        next();
    });
}
exports.DiscoverAccounts = DiscoverAccounts;


/***/ })

/******/ });