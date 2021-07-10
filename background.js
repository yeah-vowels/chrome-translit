/* chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
      files: ['dict-chinese.js', 'main.js']
  });
});
*/



//var r = Math.floor(Math.random() * dicts.length)
//var sessionDict = dicts[r]
//localStorage.sessionDict = "dict/dict-english.js"
//localStorage.sessionDict = "dict/dict-chinese.js"


// see https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/browserAction/make_page_red/background.js

/* chrome.browserAction.onClicked.addListener(function(tab) {
    mannifyPage(sessionDict)
}) */

// needs permissions: <all_urls>
chrome.webNavigation.onCompleted.addListener(function(tab) {

    // if not in parent frame, break off.
    // see https://stackoverflow.com/questions/37779142/chrome-webnavigation-oncompleted-event-firing-multiple-times
    if (tab.frameId != 0) {
	return;
    }

    // say hello
    chrome.tabs.executeScript(null, { code: "console.log('chrome.webNavigation.onCompleted in frameId 0')"})

//    mannifyPageMultidict()
    
    // depending on content
    chrome.storage.sync.get(["on", "touchLatin"], function(data) {
	console.log("background data.on: " + data.on)
	if(data.on) {
	    transcribePage(tab, data.touchLatin)
	}
    })


})

/* chrome.browserAction.onClicked.addListener(function(tab) {
    transcribePage2(tab)
}) */

// keep in sync with popup.js
