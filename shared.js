
function transcribePage(tab, touchLatin) {
    executeScripts(null, [
	{ file: 'lm-names-and-google.js' },
	{ file: 'kanjidict.js' },
	{ code: 'var tab_url = "' + tab.url + '"' },
	{ code: 'var touchLatin = "' + touchLatin + '"' },
	{ file: 'main.js'}
    ])
}


// to preserve state between various js scripts, see https://stackoverflow.com/questions/21535233/injecting-multiple-scripts-through-executescript-in-google-chrome
// keep in sync with popup.js
function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}


