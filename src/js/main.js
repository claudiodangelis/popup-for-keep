var main = function (settings) {
    if (typeof settings !== 'object') {
        console.error('There was a problem requesting settings');
    }
    if (typeof settings.accounts === 'undefined') {
        settings.accounts = {
            lastUsed: 0
        };
    }
    if (typeof settings.showMenu === 'undefined') {
      settings.showMenu = true
    }
    var postfix = 'u/' + settings.accounts.lastUsed + '/';
    Views.show(Views.SPINNER);
    Views.setAttributes(Views.KEEP, {
        width: 500, height: 500, src: GOOGLE_KEEP_URL + postfix
    });
    var buttonDetach = document.getElementById('btn-detach');
    buttonDetach.addEventListener('click', function (e) {
        var left = e.clientX + e.view.screenLeft - 250;
        var top = e.screenY - 10;
        chrome.windows.create({
            url: GOOGLE_KEEP_URL + postfix,
            width: 500,
            height: 500,
            left: left,
            top: top,
            focused: true,
            type: 'popup'
        }, function (window) {
            chrome.runtime.sendMessage({action: 'set-popout', args: window.id});
        });
    });
    var buttonSettings = document.getElementById('btn-settings');
    buttonSettings.addEventListener('click', function () {
        window.open(
            chrome.extension.getURL('options.html')
        );
    });
    var buttonAccount = document.getElementById('img-account');
    if (typeof settings.accounts.list !== 'undefined') {
        buttonAccount.src = settings.accounts.list[settings.accounts.lastUsed].image;
    }
    buttonAccount.addEventListener('click', function () {
        window.open(chrome.extension.getURL('options.html'));
    });
    document.getElementById('login-btn').onclick = function () {
        chrome.tabs.create({url: GOOGLE_ACCOUNT_URL});
    };
    var isGoogleAccountUrl = function (header) {
        return (header.value.indexOf(GOOGLE_ACCOUNT_URL) === 0);
    };
    // We use this to prevent the 'Refused to display document because display
    // forbidden by X-Frame-Options' issue
    chrome.webRequest.onHeadersReceived.addListener(
        function(req) {
            var headers = req.responseHeaders;
            if (req.url === GOOGLE_KEEP_URL + postfix) {
                Views.show(Views.KEEP);
                if (settings.showMenu === true) {
                  Views.add(Views.TOOLBAR);
                }
            }
            for (var i = headers.length - 1; i >= 0; --i) {
                var header = headers[i].name.toLowerCase();
                if (header == 'location' && isGoogleAccountUrl(headers[i])) {
                    Views.show(Views.NOTAUTH);
                    // Canceling the request
                    return { cancel: true };
                }
                if (header == 'x-frame-options' || header == 'frame-options') {
                    headers.splice(i, 1);
                }
            }
            return {responseHeaders: headers};
        },
        { urls: [ '*://*/*' ], types: [ 'sub_frame' ] },
        ['blocking', 'responseHeaders']
    );
};
window.onload = function () {
    chrome.runtime.sendMessage({action: 'get-settings'}, function (settings) {
        main(settings);
    });
};
