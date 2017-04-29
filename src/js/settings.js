var Settings = {
    load: function (callback) {
        chrome.storage.sync.get('settings', function (data) {
            var retValue = data.settings;
            if (typeof retValue === 'undefined') {
                retValue = {
                    icon: 'icon_bichrome',
                    showMenu: true,
                    accounts: {
                        lastChecked: 0
                    }
                };
            }
            settings = retValue;
            callback(retValue);
        });
    },
    save: function (settings, callback) {
        settings = settings;
        chrome.storage.sync.set({settings: settings}, function () {
            var retValue = {success: true, message: null};
            if (chrome.runtime.lastError) {
                retValue = {
                    success: false,
                    message: chrome.runtime.lastError.message
                };
            } else {
                chrome.runtime.sendMessage({
                    action: 'update-settings',
                    settings: settings
                });
            }
            callback(retValue);
        });
    }
};
