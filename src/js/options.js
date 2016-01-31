$(document).ready(function() {
    $('select').material_select();
    Settings.load(function (settings) {
        $('input#$id'.replace('$id', settings.icon)).prop('checked', true);
        $('input:radio[name=group-icon]').change(function () {
            settings.icon = $('input:radio[name=group-icon]:checked').val();
            chrome.browserAction.setIcon({
                path: paths[settings.icon]
            });
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
        });
    });
});
