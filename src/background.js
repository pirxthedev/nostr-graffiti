import {
  relayInit
} from 'nostr-tools'

console.log("popup.js loaded")

chrome.runtime.onInstalled.addListener(async () => {
  const relay = relayInit('wss://nostr.zebedee.cloud')
  await relay.connect()

  relay.on('connect', () => {
    console.log(`connected to ${relay.url}`)
  })
  relay.on('error', () => {
    console.log(`failed to connect to ${relay.url}`)
  })

  // let's query for an event that exists
  let sub = relay.sub([
    {
      authors: ['82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2'],
      limit: 1,
    }
  ])
  sub.on('event', event => {
    console.log('we got the event we wanted:', event)
  })
  sub.on('eose', () => {
    sub.unsub()
  })
});

