var Settings = {
    load: function (callback) {
        chrome.storage.sync.get('settings', function (data) {
            var retValue = data.settings;
            if (typeof retValue === 'undefined') {
                retValue = {
                    icon: 'icon_bichrome',
                    accounts: {
                        lastChecked: 0
                    }
                };
            }
            callback(retValue);
        });
    },
    save: function (settings, callback) {
        chrome.storage.sync.set({settings: settings}, function () {
            var retValue = {success: true, message: null};
            if (chrome.runtime.lastError) {
                retValue = {
                    success: false,
                    message: chrome.runtime.lastError.message
                };
            }
            callback(retValue);
        });
    }
};
