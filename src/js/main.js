/* Top level objects */
// iframe that will wrap Keep
var keepView = document.querySelector("#keep-view");
// Spinner
var spinnerView = document.querySelector("#spinner-view");
// Not auth
var notAuthView = document.querySelector("#notAuth-view");

// Views
var views = [keepView, spinnerView, notAuthView];

showView(spinnerView);

// We handle the frame here
// When it's loaded:
keepView.onload = function () {
    // Hide the spinnerView
    showView(keepView);
};

keepView.width = 500;
keepView.height = 500;
keepView.src = "https://keep.google.com/keep";

// We use this to prevent the "Refused to display document because display
// forbidden by X-Frame-Options" issue
chrome.webRequest.onHeadersReceived.addListener(
    function(req) {
        var headers = req.responseHeaders;
        var toRemove = false;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == "location" && headers[i].value.indexOf("https://accounts.google.com/ServiceLogin") == 0) {
                // Removing the iframe
                keepView.remove();
                // Showing the not-auth view
                showView(notAuthView);
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

function showView(view) {
    for (var i = 0; i < views.length; i++) {
        if (view == views[i]) {
            views[i].style.visibility = "visible";
            views[i].style.display = "block";
        } else {
            views[i].style.visibility = "hidden";
            views[i].style.display = "none";
        }
    }
}
