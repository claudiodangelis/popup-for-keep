var DOM = {
    main: ''
};
chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
    // Bring focus
    document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4.qAWA2 > div.IZ65Hb-n0tgWb > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd'
    ).click();
    // Text wrapper
    document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd'
    ).textContent = '';
    // Set title
    document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div:nth-child(3)'
    ).textContent = msg.title;
    // Set text
    document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div:nth-child(5)'
    ).textContent = msg.text;
        document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div:nth-child(3)'
    ).focus();
    // Title wrapper
    document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf.LwH6nd'
    ).textContent = '';
    document.querySelector(
        'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div:nth-child(3)'
    ).blur();
    sendResponse({status: 'done'});
    history.pushState(null, null, '/keep');
});
