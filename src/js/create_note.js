var DOM = {
    main:           'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4.qAWA2 > div.IZ65Hb-n0tgWb > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    textWrapper:    'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc.ogm-kpc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    titleWrapper:   'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf.LwH6nd',
    title:          'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc.ogm-kpc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf:not(.LwH6nd)',
    text:           'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc.ogm-kpc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf:not(.LwH6nd)'
};
chrome.runtime.onMessage.addListener(function (note, _, sendResponse) {
    var main, title, text, titleWrapper, textWrapper;
    main = document.querySelector(DOM.main)
        .click();
    textWrapper = document.querySelector(DOM.textWrapper)
        .textContent = '';
    title = document.querySelector(DOM.title);
    title.click();
    title.textContent = note.title;
    text = document.querySelector(DOM.text);
    text.textContent = note.text;
    text.click();
    title.focus();
    titleWrapper = document.querySelector(DOM.titleWrapper)
        .textContent = '';
    title.blur();
    sendResponse({ status: 'done' });
    history.pushState(null, null, '/keep');
});
