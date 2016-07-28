// Load settings
var settings;
Settings.load(function (data) {
    settings = data;
    chrome.browserAction.setIcon({
        path: paths[settings.icon]
    });
    if (typeof settings.accounts.lastUsed === 'undefined') {
        // Force discovery
        settings.accounts.lastChecked = 0;
    }
    // TODO: Let user choose time between accounts discovery
    if (elapsedSince(settings.accounts.lastChecked) > (2 * HOURS)) {
        Account.getAll(function (err, accounts) {
            settings.accounts.lastChecked = new Date().getTime();
            if (err) {
                // No accounts found
                accounts = [];
                accounts.push({ email: 'unkown', name: 'unkown', image: null });
                // Force check next time
                settings.accounts.lastChecked = 0;
            }
            settings.accounts.list = accounts;
            if (typeof settings.accounts.lastUsed === 'undefined') {
                // Set the first found as current user, but let user choose if
                // there are more than one
                settings.accounts.lastUsed = 0;
                if (settings.accounts.list.length > 1) {
                    // Open options page
                    console.debug('Opening options page');
                    chrome.tabs.create({
                        url: 'options.html' + '?modal-choose-user'
                    });
                }
            }
            Settings.save(settings, function (status) {
                console.debug('Saving settings', status);
            });
        });
    }
});
// Listen for messages
var popout = null;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (sender === null) {
        console.error('null sender');
    }
    if (request.action === 'update-settings') {
        settings = request.settings;
        sendResponse();
    } else if (request.action === 'get-settings') {
        sendResponse(settings);
    } else if (request.action === 'am-i-the-popout') {
        sendResponse(popout === sender.tab.windowId);
    } else if (request.action === 'set-popout') {
        popout = request.args;
    }
    return true;
});
var addToKeep = function (info, tab) {
    var title, text;
    title = tab.title;
    if (typeof info.selectionText === 'undefined') {
        text = tab.url;
    } else {
        text = [info.selectionText, tab.url].join('\n\n');
    }
    if (typeof settings.accounts === 'undefined') {
        settings.accounts = {};
    }
    var postfix = settings.accounts.lastUsed || '0';
    chrome.tabs.create({
        url: 'https://keep.google.com/u/' + postfix + '/?create_note'
    }, function (target) {
        chrome.tabs.onUpdated.addListener(function listener(id, info) {
            if (id === target.id && info.status === 'complete') {
                chrome.tabs.sendMessage(target.id, {
                    title: title, text:text
                }, {}, function (response) {
                    if (typeof response !== 'undefined' && response.status === 'done') {
                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                });
            }
        });
    });
};
// Create context menus
['page', 'selection'].forEach(function (context) {
    chrome.contextMenus.create({
        'title': ['Add', context, 'to Google Keep'].join(' '),
        'contexts': [ context ],
        'onclick': addToKeep
    });
});
