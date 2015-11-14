var DOM = {
    main: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4.qAWA2 > div.IZ65Hb-n0tgWb > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    textWrapper: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    titleWrapper: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf.LwH6nd',
    title: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div:nth-child(3)',
    text: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div:nth-child(5)'
};
chrome.runtime.onMessage.addListener(function (note, _, sendResponse) {
    document.querySelector(DOM.main).click();
    document.querySelector(DOM.textWrapper).textContent = '';
    document.querySelector(DOM.title).textContent = note.title;
    document.querySelector(DOM.text).textContent = note.text;
    document.querySelector(DOM.title).focus();
    document.querySelector(DOM.titleWrapper).textContent = '';
    document.querySelector(DOM.title).blur();
    sendResponse({ status: 'done' });
    history.pushState(null, null, '/keep');
});
