window.onload = function () {
    // Google Analytics tracking code
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-60445871-1']);
    _gaq.push(['_trackPageview']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    /* Top level objects */
    var GOOGLE_ACCOUNT_URL = "https://accounts.google.com/ServiceLogin";
    // Detach button
    var buttonDetach = document.querySelector("span#btn-detach");
    Views.show(Views.SPINNER);
    Views.setAttributes(Views.KEEP, {
        width: 500, height: 500, src: 'https://keep.google.com/keep'
    });
    buttonDetach.addEventListener("click", function (e) {
        var left = e.clientX + e.view.screenLeft - 250;
        var top = e.screenY - 10;
        chrome.windows.create({
            url: "https://keep.google.com/keep",
            width: 500,
            height: 500,
            left: left,
            top: top,
            focused: true,
            type: "popup"
        });
    });
    // We use this to prevent the "Refused to display document because display
    // forbidden by X-Frame-Options" issue
    chrome.webRequest.onHeadersReceived.addListener(
        function(req) {
            var headers = req.responseHeaders;
            var toRemove = false;
            if (req.url === 'https://keep.google.com/keep') {
                Views.show(Views.KEEP);
                Views.add(Views.TOOLBAR);
            }
            for (var i=headers.length-1; i>=0; --i) {
                var header = headers[i].name.toLowerCase();
                if (header == "location" && headers[i].value.indexOf(GOOGLE_ACCOUNT_URL) == 0) {
                    // Showing the not-auth view
                    Views.show(Views.NOTAUTH);
                    // Canceling the request
                    return {cancel: true};
                }
                if (header == 'x-frame-options' || header == 'frame-options') {
                    headers.splice(i, 1);
                }
            }
            return {responseHeaders: headers};
        },
        {
            urls: [ '*://*/*' ],
            types: [ 'sub_frame' ]
        },
        ['blocking', 'responseHeaders']
    );
    // Bind the login button
    document.querySelector("#login-btn").onclick = function (e) {
        chrome.tabs.create({url: GOOGLE_ACCOUNT_URL});
    };
}