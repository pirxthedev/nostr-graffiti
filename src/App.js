import { NostrProvider } from 'nostr-react';
import './App.css';
import NoteFeed from './components/NoteFeed';
import Post from './components/Post';

const relayUrls = [
  'wss://brb.io',
  "wss://nostr-pub.wellorder.net",
  "wss://relay.nostr.ch"
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
