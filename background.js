// Run when a page is finished loaded
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status == "complete") {
	chrome.tabs.executeScript(null, {file: "code.js"});
    }
});
