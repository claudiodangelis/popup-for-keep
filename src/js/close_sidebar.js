// Note: this causes the overlaying sidebar to be closed.
// Ref.#26
var attemptClosingSidebar = function () {
    var notesContainer = document.querySelector('body > div.notes-container');
    try {
        notesContainer.click();
    } catch (_) {
        setTimeout(function () {
            attemptClosingSidebar();
        }, 1000);
    }
};
// Try to access the top window. If the error mentions a cross-origin issue,
// we assume Keep is being called from the extension so we can inject the code
// that closes the sidebar.
//
// Not a big fan of this solution to be honest, there could be other reasons why
// `window.top` could not be accessible.
try {
    window.top.name = '';
} catch (ex) {
    if (ex.message.indexOf('cross-origin') !== -1) {
        attemptClosingSidebar();
    }
}
