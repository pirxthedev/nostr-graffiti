import { relayInit } from 'nostr-tools';

const nos2xId = "kpgefcfmnafjgpblomihpgmejjdanjjp";

export async function getCurrentUrl() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let url = '';
    try {
        let [tab] = await chrome.tabs.query(queryOptions);
        url = tab.url;
    } catch (error) {
        console.log("Not running as a Chrome extension. Fallback to URL of current page.");
        url = window.location.href;
    }
    return url;
}

export async function createHighlightNote(text, url, fragment) {

    // Create nostr event
    let event = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['r', url]],
        content: '"' + text + '"\n\n' + url + fragment,
        id: null,
        pubkey: null
    }

    // Sign event
    let signed_event = await chrome.runtime.sendMessage(
        nos2xId,
        {
            type: 'signEvent',
            params: {event}
        }
    );

    return signed_event;
}

export async function postEventToNostr(event) {
    let relays = await chrome.runtime.sendMessage(
        nos2xId,
        {
            type: 'getRelays',
            params: {}
        }
    );

    // Get list of keys from relays
    const relayUrls = Object.keys(relays);
    relayUrls.forEach(async (url) => {
        // Connect to relay
        console.log(url);
        const connection = relayInit(url);
        await connection.connect();
        connection.on('connect', () => {
            console.log('Connected to ' + url);
        });
        connection.on('error', () => {
            console.log('Error connecting to ' + url);
        });

        // Publish event to relay
        let pub = connection.publish(event);
        pub.on('ok', () => {
            console.log('Published event to ' + url);
            connection.close();
        });
        pub.on('seen', () => {
            console.log('Event seen on ' + url);
            connection.close();
        });
        pub.on('failed', (reason) => {
            console.log('Failed to publish event to ' + url + ': ' + reason);
            connection.close();
        });

    });
}

export async function updateEventsForUrl(url) {
    let relays = await chrome.runtime.sendMessage(
        nos2xId,
        {
            type: 'getRelays',
            params: {}
        }
    );

    // Get list of keys from relays
    const relayUrls = Object.keys(relays);
    relayUrls.forEach(async (relayUrl) => {
        // Connect to relay
        console.log(relayUrl);
        const connection = relayInit(relayUrl);
        await connection.connect();
        connection.on('connect', () => {
            console.log('Connected to ' + relayUrl);
        });
        connection.on('error', () => {
            console.log('Error connecting to ' + relayUrl);
        });

        // Get events from relay
        let get = connection.sub([{kinds: [1], '#r': [url], since: 0}]);
        get.on('event', (event) => {
            storeEventForUrl(event, url)
            console.log('Got event from ' + relayUrl);
        });
        get.on('eose', () => {
            console.log('Got all events from ' + relayUrl);
        });
    });
}

export async function storeEventForUrl(event, url) {
    // Get the map of events stored for this URL in local storage
    let url_data = await chrome.storage.local.get(url);

    // If there are no events stored for this URL, create an empty array
    if (!url_data[url]) {
        url_data[url] = { events: [] };
    }
    // For the current event, check if it is already stored in the stored_events array
    if (!url_data[url].events.some((e) => e.id === event.id)) {
        // If the event is not already stored, add it to the array
        url_data[url].events.push(event);
        // Store the updated array of events in local storage with the URL as the key
        chrome.storage.local.set({ [url]: url_data[url] });
    }

}