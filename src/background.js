import {
    createHighlightNote,
    postEventToNostr,
    updateEventsForUrl
} from './utils.js';


let contextMenuItem = {
    "id": "postToNostr",
    "title": "Post to nostr",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(async function(clickData){
    if (clickData.menuItemId == "postToNostr" && clickData.selectionText) {
        let note = await createHighlightNote(clickData.selectionText, clickData.pageUrl);
        console.log(note);
        postEventToNostr(note);
    }
});

// Handle messages from the content script or popup script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.type === "updateEventsForUrl") {
        await updateEventsForUrl(request.url);
    }
});
