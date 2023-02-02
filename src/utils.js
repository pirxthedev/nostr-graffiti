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

export async function createHighlightNote(content, url) {

    let event = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['r', url]],
        content: '"' + content + '"\n\n' + url,
        id: null,
        pubkey: null
    }

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