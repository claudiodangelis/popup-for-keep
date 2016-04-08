var addToKeep = function (info, tab) {
    var title, text;
    title = tab.title;
    if (typeof info.selectionText === 'undefined') {
        text = tab.url;
    } else {
        text = [info.selectionText, tab.url].join('\n\n');
    }
    chrome.tabs.create({
        url: 'https://keep.google.com/keep?create_note'
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
// Load settings
Settings.load(function (settings) {
    chrome.browserAction.setIcon({
        path: paths[settings.icon]
    });
});
