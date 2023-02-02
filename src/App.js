import { NostrProvider } from 'nostr-react';
import './App.css';
import NoteFeed from './components/NoteFeed';
import Post from './components/Post';

const relayUrls = [
  'wss://brb.io',
  "wss://nostr-pub.wellorder.net",
  "wss://relay.nostr.ch",
  "wss://nostr.fmt.wiz.biz",
  "wss://nostr.oxtr.dev",
  "wss://relay.damus.io",
  "wss://relay.nostr.bg",
  "wss://relay.snort.social"
];

function App() {
  return (
    <NostrProvider relayUrls={relayUrls} debug={true}>
      <div className="App">
        <NoteFeed />
        <Post />
      </div>
    </NostrProvider>
  );
}

export default App;
