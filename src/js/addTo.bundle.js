/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ({

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(60);


/***/ }),

/***/ 60:
/***/ (function(module, exports) {

// TODO: There is some duplicate code that can be wrapped together
const DOM = {
    mainWrapper: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4.qAWA2 > div.IZ65Hb-n0tgWb > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    textWrapper: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc.ogm-kpc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd',
    titleNode: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc.ogm-kpc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf:not(.LwH6nd)',
    textNode: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc.ogm-kpc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.h1U9Be-YPqjbf:not(.LwH6nd)',
    titleWrapper: 'body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-bN97Pc > div.h1U9Be-xhiy4 > div.IZ65Hb-n0tgWb.IZ65Hb-QQhtn > div.IZ65Hb-TBnied.HLvlvd-h1U9Be > div.IZ65Hb-s2gQvd > div.notranslate.IZ65Hb-YPqjbf.r4nke-YPqjbf.LwH6nd'
};
const createNote = (note) => {
    return new Promise((resolve, reject) => {
        // Expand the box
        const mainWrapper = document.querySelector(DOM.mainWrapper);
        if (mainWrapper === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'main wrapper not found'
            });
        }
        mainWrapper.click();
        // Hide the placeholders
        const textWrapper = document.querySelector(DOM.textWrapper);
        if (textWrapper === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'text wrapper not found'
            });
        }
        textWrapper.textContent = '';
        // Populate the actual fields
        const titleNode = document.querySelector(DOM.titleNode);
        if (titleNode === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'title node not found'
            });
        }
        titleNode.click();
        titleNode.textContent = note.title;
        const textNode = document.querySelector(DOM.textNode);
        if (textNode === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'text node not found'
            });
        }
        textNode.textContent = note.text;
        textNode.click();
        titleNode.focus();
        const titleWrapper = document.querySelector(DOM.titleWrapper);
        if (titleWrapper === null) {
            return reject({
                status: 'done',
                success: false,
                error: 'title wrapper not found'
            });
        }
        titleWrapper.textContent = '';
        titleNode.blur();
        resolve({
            status: 'done',
            success: true
        });
    });
};
chrome.runtime.onMessage.addListener((body, _, sendResponse) => {
    createNote(body).then(sendResponse).catch(sendResponse);
    window.history.pushState(null, null, '/keep');
    return true;
});


/***/ })

/******/ });