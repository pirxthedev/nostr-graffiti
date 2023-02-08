import { nip19 } from 'nostr-tools';

export function Note(props) {

  return (
    <div key={props.key} style={{
      backgroundColor: '#f5f8fa',
      borderRadius: '10px',
      padding: '10px',
      margin: '10px',
      border: '1px solid #e1e8ed'
    }}>
      <div>
        <a href={'https://brb.io/u/' + nip19.npubEncode(props.event.pubkey)} target="_blank" style={{
          textDecoration: 'none',
          color: '#1da1f2',
          fontWeight: 'bold',
          fontSize: '14px',
        }}>
          <img src='/logo192.png' style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            marginRight: '10px',
            // Display the image in the top left corner and allow text to wrap around it
            float: 'left',
          }} />
        </a>
        <div style={{
          fontSize: '14px',
          // maintain the same indentation as the image
          marginLeft: '40px',
        }}>
          {props.event.content}
        </div>
      </div>
    </div>
  );
}

