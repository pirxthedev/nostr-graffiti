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

chrome.contextMenus.onClicked.addListener(async function(clickData, tab){
    if (clickData.menuItemId == "postToNostr" && clickData.selectionText) {
        // send message to content script to get current selection
        const response = await chrome.tabs.sendMessage(
            tab.id,
            { type: 'getSelection' }
        );
        let event = await createHighlightNote(response.text, response.url, response.fragment);
        postEventToNostr(event);
        updateEventsForUrl(response.url);
    }
});

// Handle messages from the content script or popup script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.type === "updateEventsForUrl") {
        await updateEventsForUrl(request.url);
    }
});
