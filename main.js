// transcribe page

// depends on unicodeDictArray and kanjiDictArray

// document.body.style.border = "5px solid red";

var unicodeDict = new Map()
for (var entry of unicodeDictArray) {
    // if values appear more than once, take the last, it's probably from the edit file
    unicodeDict.set(entry[0], entry[1])
}

var kanjiDict = new Map()
for (var entry of kanjiDictArray) {
    // if values appear more than once, take the last, it's probably from the edit file
    kanjiDict.set(entry[0], entry[1])
}

console.log("hello transcribe page")

// replace text nodes, see https://github.com/Woundorf/foxreplace/blob/master/scripts/replace.js
var textNodesXpath = "/html/head/title/text()"
                     + "|/html/body//text()[not(parent::script)]";
var textNodes = document.evaluate(textNodesXpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var nTextNodes = textNodes.snapshotLength;
for (var i = 0; i < nTextNodes; i++) {
    var textNode = textNodes.snapshotItem(i);
    let oldTextContent = textNode.textContent;
    var newTextContent = oldTextContent

    newTextContent = transcribe(oldTextContent, unicodeDict)
//    newTextContent = stripMarks(newTextContent)

    if (oldTextContent !== newTextContent) {
	textNode.textContent = newTextContent
    }
}

function isJapanese(text) {
    return text.match(/\p{Script=Hiragana}/ug) || text.match(/\p{Script=Katakana}/ug)
}

// remove all non-letters
// with the u unicode flag it seems to work, but might be a bit to much, so call is commented out
function stripMarks(string) {
    // see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    return string.normalize("NFD").replace(/\P{L}/ug, '')
}

function transcribe(oldTextContent, unicodeDict) {
    // insert blanks in chinese or thai
    var nblanks = (oldTextContent.match(/ /g) || []).length
    var insertBlanks = false
    
    //    oldTextContent = oldTextContent.normalize("NFD")
    oldTextContent = oldTextContent.normalize("NFD") // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    var newTextContent = ""
    for (var i = 0; i < oldTextContent.length; i++) {
	var c = oldTextContent.charAt(i)
//    for (var c of oldTextContent) {

	// on google page and latin? skip. latin replacements screw up the page, whyever
	if(tab_url.match(/[^\/]*google/) && c.match(/\p{Script=Latin}/u)) {
	    newTextContent += c
	    continue
	}

	// if touch latin is disabled in the preferences, skip
	// typeof(touchLatin) is string
	if(c.match(/\p{Script=Latin}/u) && touchLatin === "false") {
	    newTextContent += c
	    continue
	} 
	
	// chinese? insert blanks.
	if (/[\u3400-\u9FBF]/.test(c)) {
	    newTextContent += " "
	}
	// number and last character chinese? insert blank
	if (c.match(/\p{N}/u) && i > 0 && oldTextContent.charAt(i-1).match(/[\u3400-\u9FBF]/)) {
	    newTextContent += " "
	}
	// japanese, hiragana, katakana, kanji? insert blanks.
	if (c.match(/\p{Script=Hiragana}/u) || c.match(/\p{Script=Katakana}/u) || c.match(/[\u4e00-\u9fbf]/)) {
	    newTextContent += " "
	}

	// insert greek h accent before last: from ohs to hos, uhpo to hupo
	if (c.match(/\u0314/)) {
	    var l = newTextContent.length
	    // see https://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string/4364902
	    newTextContent = newTextContent.substring(0, l-1) + unicodeDict.get(c) + newTextContent.substring(l-1)
	    continue;
	}
	
	newC = c;
	if(unicodeDict.has(c)) {
	    newC = unicodeDict.get(c)
	}
	// japanese kanji? (the chinese glyphs in japanese language)
	if ( /[\u4e00-\u9fbf]/.test(c) && kanjiDict.has(c) && isJapanese(oldTextContent)) {
	    newC = kanjiDict.get(c)
	}
	newTextContent += newC
	
    }
    return newTextContent
}


