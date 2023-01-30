import {
    relayInit,
    getEventHash,
    signEvent
} from 'nostr-tools'


async function postNote(relays, sk, pk, url, content) {
    const relay = relayInit(relays[0]);
    await relay.connect()

    relay.on('connect', () => {
        console.log(`connected to ${relay.url}`)
    })
      relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
    })

    let event = {
        kind: 1,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['r', url]],
        content: content
    }
    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);

    let pub = relay.publish(event);
    pub.on('ok', () => {
        console.log(`${relay.url} has accepted our event`)
    });
    pub.on('seen', () => {
        console.log(`we saw the event on ${relay.url}`)
    });
    pub.on('failed', reason => {
        console.log(`failed to publish to ${relay.url}: ${reason}`)
    });

    await relay.close();
}


async function getCurrentUrl() {
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


export { postNote, getCurrentUrl };