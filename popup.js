// debug: right click, inspect element, in js console type location.reload(true)
// see https://stackoverflow.com/questions/5039875/debug-popup-html-of-a-chrome-extension

mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'))

document.querySelector(".foo-button").addEventListener("click", function() {
    chrome.tabs.getSelected(null, function(tab) {
	chrome.storage.sync.get(["on", "touchLatin"], function(data) {
	    console.log("background data.on: " + data.on)
	    if(data.on) {
		transcribePage(tab, data.touchLatin)
	    }
	})
    })
/*    console.log("button click")
    chrome.tabs.executeScript(null, { file: "main.js" }) */
})

// see https://stackoverflow.com/questions/52414661/material-design-components-web-in-chrome-extension
// for multi see https://github.com/material-components/material-components-web/blob/master/docs/importing-js.md
// for switchControl see  https://stackoverflow.com/questions/57447776/cannot-read-property-mdcswitch-of-undefined-error-when-importing-an-mdc-swit

// mdc.switchControl.MDCSwitch.attachTo(document.querySelector('.mdc-switch'))

const switches = [].map.call(document.querySelectorAll('.mdc-switch'), function (el) {
    return mdc.switchControl.MDCSwitch.attachTo(el)
})

// document.querySelector(".mdc-switch input").checked = false

chrome.storage.sync.get("on", function(data) {
    if(data.on) { 
	switches[0].checked = data.on
    }
})

chrome.storage.sync.get("touchLatin", function(data) {
    if(data.touchLatin) { 
	switches[1].checked = data.touchLatin
    }
})


// for event listener see https://stackoverflow.com/questions/46686070/material-components-change-event-in-mdccheckbox-not-working
const evt = [].map.call(document.querySelectorAll(".mdc-switch input"), function (el) {
    el.addEventListener("click", () => {
	console.log("clicked id:" + el.id)

	switch (el.id) {
	case "on":
	    console.log(el.checked)
	    chrome.storage.sync.set({ on: el.checked })
	case "touch-latin":
	    chrome.storage.sync.set({ touchLatin: el.checked })
//	    document.querySelector("#console").innerText = "hello on"
	    
	}
    })
})
    
// console.log(switches)

