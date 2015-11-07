var main = function () {
    Views.show(Views.SPINNER);
    Views.setAttributes(Views.KEEP, {
        width: 500, height: 500, src: GOOGLE_KEEP_URL
    });
    var buttonDetach = document.querySelector('span#btn-detach');
    buttonDetach.addEventListener('click', function (e) {
        var left = e.clientX + e.view.screenLeft - 250;
        var top = e.screenY - 10;
        chrome.windows.create({
            url: GOOGLE_KEEP_URL,
            width: 500,
            height: 500,
            left: left,
            top: top,
            focused: true,
            type: 'popup'
        });
    });
    document.querySelector('#login-btn').onclick = function (e) {
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
            if (req.url === GOOGLE_KEEP_URL) {
                Views.show(Views.KEEP);
                Views.add(Views.TOOLBAR);
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
Analytics.init();
window.onload = main;
