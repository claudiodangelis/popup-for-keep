var Views = {
    KEEP: 'keep',
    SPINNER: 'spinner',
    NOTAUTH: 'notAuth',
    TOOLBAR: 'toolbar',
    INFO: 'info',
    setAttributes: function (view, properties) {
        var node = document.getElementById(view + '-view');
        Object.keys(properties).forEach(function (key) {
            node.setAttribute(key, properties[key]);
        });
    },
    show: function (view) {
        var node = document.getElementById(view + '-view');
        [Views.KEEP, Views.SPINNER, Views.NOTAUTH].forEach(function (v) {
            Views.hide(v);
        });
        node.style.visibility = 'visible';
        node.style.display = 'block';
    },
    hide: function (view) {
        var node = document.getElementById(view + '-view');
        node.style.visibility = 'hidden';
        node.style.display = 'none';
    },
    add: function (view) {
        var node = document.getElementById(view + '-view');
        node.style.visibility = 'visible';
        node.style.display = 'block';
    },
    remove: function (view) {
        var node = document.getElementById(view + '-view');
        node.style.visibility = 'hidden';
        node.style.display = 'none';
    }
};