import { generateFragment } from './fragment-generation-utils';

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // if the message is a request to get the current selection
    if (request.type === "getSelection") {
        // get the current selection text
        const selection = window.getSelection();

        // Generate highlight fragment using Google's fragment generation utils from
        // https://github.com/GoogleChromeLabs/link-to-text-fragment/blob/main/fragment-generation-utils.js
        // Usage of generateFragment based on https://stackoverflow.com/a/73425285
        const fragmentResult = generateFragment(selection);
        let fragmentString = '';
        if (fragmentResult.status === 0) {
            const fragment = fragmentResult.fragment;
            const prefix = fragment.prefix ?
                `${encodeURIComponent(fragment.prefix)}-,` :
                '';
            const suffix = fragment.suffix ?
                `,-${encodeURIComponent(fragment.suffix)}` :
                '';
            const textStart = encodeURIComponent(fragment.textStart);
            const textEnd = fragment.textEnd ?
                `,${encodeURIComponent(fragment.textEnd)}` :
                '';
            fragmentString = `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
        }

        // send the current selection to the background script
        sendResponse({text: selection.toString(), url: window.location.href, fragment: fragmentString});
    } else if (request.type === "fragment") {
        // See https://github.com/WICG/scroll-to-text-fragment/blob/main/fragment-directive-api.md
        location.hash = request.fragment;
    }
});