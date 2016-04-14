var paths = {
    icon_bichrome: 'img/icon-32.png',
    icon_monochrome: 'img/mono-icon-32.png'
};
var elapsedSince = function (time) {
    time = (typeof time === 'number') ? time : 0;
    return new Date().getTime() - time;
};
var HOURS = 3600000;
