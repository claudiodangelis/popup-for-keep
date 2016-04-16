$(document).ready(function() {
    var saveSettings = function (settings) {
        Settings.save(settings, function (status) {
            if (status.success === true) {
                Materialize.toast('Options saved', 4000);
            } else {
                Materialize.toast(
                    'Unable to save options: $message'.replace(
                        '$message', status.message
                    ), 8000
                );
            }
        });
    };
    $('select').material_select();
    Settings.load(function (settings) {
        $('input#$id'.replace('$id', settings.icon)).prop('checked', true);
        $('input:radio[name=group-icon]').change(function () {
            settings.icon = $('input:radio[name=group-icon]:checked').val();
            chrome.browserAction.setIcon({
                path: paths[settings.icon]
            });
            saveSettings(settings);
        });
        // Populate accounts
        settings.accounts.list.forEach(function (account, index) {
            var input = $('<input>').attr({
                type: 'radio', name: 'group-account', id: 'account-' + index
            });
            input.change(function () {
                if ($(this).prop('checked') === true) {
                    settings.accounts.lastUsed = index;
                    saveSettings(settings);
                }
            });
            if (account.index === settings.accounts.lastUsed) {
                input.prop('checked', true);
            }
            var label = $('<label>').attr({
                'for': 'account-' + index
            });
            var img = $('<img>').attr({
                src: account.image,
                height: 64,
                width: 64
            });
            // Pack
            label.append(img);
            $('#accounts-container').append(input, label);
        });
        if (location.search === '?modal-choose-user') {
            $('#modal1').openModal();
        }
    });
});
