chrome.runtime.onInstalled.addListener(function (details) {
    var currentVersion = chrome.runtime.getManifest().version;
    if (details.reason === 'update' && currentVersion === '0.5.0') {
        // Spawns the newsletter entry
        chrome.tabs.create({
            url: 'https://claudiodangelis.com/newsletters/2015-11-07-popup-for-keep-now-loads-faster.html'
        });
    }
});