// We use this to prevent the "Refused to display document because display
// forbidden by X-Frame-Options" issue
chrome.webRequest.onHeadersReceived.addListener(
    function(req) {
        var headers = req.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
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


/* Top level objects */
// iframe that will wrap Keep
var keepFrame = document.querySelector("#keep-wrapper");
// Spinner
var spinner = document.querySelector("#spinner-wrapper");

// We handle the frame here
// When it's loaded:
keepFrame.onload = function () {
    // Hide the spinner
    spinner.style.visibility = "hidden";
    spinner.style.display = "none";

    // Show the iframe
    keepFrame.style.visibility = "visible";
    keepFrame.style.display = "inline";
};

keepFrame.width = 500;
keepFrame.height = 500;
keepFrame.src = "https://keep.google.com/keep";
