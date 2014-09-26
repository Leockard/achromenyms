// Replace all occurances of substring sub with replacement
function replaceAll(str, sub, replacement) {
    return str.split(sub).join(replacement);
}

// Delete duplicate items in an array.  Copied from
// http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
// Thanks!
function deleteDuplicates(arr) {
    var i;
    var len = arr.length;
    var out = [];
    var obj = {};
    for (i = 0; i < len; i++) {
	obj[arr[i]] = 0;
    }
    for (i in obj) {
	out.push(i);
    }
    return out;
}

// Given a string of initials, returns the appropriate RE object to search for the whole
// acronym. This is a RE that looks for a number of words before the parenthesized
// initials equal to the number of initials. i.e, if the <initials> is 3 letters long,
// prepareRe returns a RE that groups the 3 words before the string (<initials>) as the
// first matched group: /(\w+\s\w+\s\w+\s)(ABC)/g
function prepareRe(initials) {
    var myReStr = "";
    for (var i = 0; i < initials.length; i++) {
	myReStr += "\\w+\\s";
    };
    myReStr = "(" + myReStr + ")" + "\\(" + initials + "\\)";
    var myRe = new RegExp(myReStr, "g");
    return myRe;
};

// Returns true when <initials> is an acronym of the string <words>
function isAcronym(words, initials) {
    // Check to see if the first letters of each word in <words> is a letter in <initials>
    var wordinitials = [];
    var splitwords = words.split(" ");
    for (var w in splitwords) {
	wordinitials.push(splitwords[w].charAt(0));
    };
    return wordinitials.join("").toLowerCase() === initials.toLowerCase();
}

// Returns an array of elements of the form [words, initials].
// e.g., ["document object model", "DOM"]
// If none are found, returns []
function getAllAcronyms() {
    var text = document.getElementsByTagName("html")[0].textContent;
    var matches = text.match(/\([A-Z]+\)/g);
    var acronyms = [];
    if(matches !== null) {
	matches = deleteDuplicates(matches);
	for(var i in matches) {
	    var initials = matches[i].slice(1, -1); // forget the parentheses
	    var myRe = prepareRe(initials)
	    var acr = myRe.exec(text);
	    // Remember the first group contains the words
	    if (acr != null && isAcronym(acr[1], initials)) {
		acronyms.push([acr[1], initials]);
	    };
	};
	return acronyms;
    } else {
	// cosole.log("No acronyms found.");
	return [];
    }
};

// Here begins the code that is run every time a tab finishes loading
var acronyms = getAllAcronyms();
var paragraphs = document.getElementsByTagName("p");
for (i in acronyms) {
    var words = acronyms[i][0];
    var initials = acronyms[i][1];
    for (var j = 0; j < paragraphs.length; j++) {
	var strs = paragraphs[j].innerHTML.split(/(<a.*?>.*?<\/a>)/g);
	// strs is an array of strings of the form
	// ["some text", "<a href=...>linky </a>", "some more text", "<a href=...>another linky </a>", "and even more text"].
	// e.g. every even numbered item is a <a> tag that we should not touch. Change only odd numbered items.
	// Note that odd numbered items have even indices...
	for (var k = 0; k < strs.length; k += 2) {
	    strs[k] = replaceAll(strs[k], initials, "<span title=\"" + words + "\">" + initials + "</span>");
	};
	paragraphs[j].innerHTML = strs.join("");
    };
}
