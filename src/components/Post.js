import { useState, useEffect } from 'react';
import {
    getEventHash,
} from 'nostr-tools'
import { useNostr } from 'nostr-react';
import { getCurrentUrl } from '../utils';


export default function Post() {
    const [content, setContent] = useState('test');
    const [url, setUrl] = useState('');
    const [pk, setPk] = useState('');
    const { publish } = useNostr();
    const nos2xId = "kpgefcfmnafjgpblomihpgmejjdanjjp";

    useEffect(() => {
        getCurrentUrl().then(url => {
            setUrl(url);
        });
    }, []);

    useEffect(async () => {
        // if window.nostr is defined and pk is length 0, call getPublicKey() to get the public key
        // of the user's Nostr identity
        if (window.nostr && pk.length === 0) {
            window.nostr.getPublicKey().then(pk => {
                setPk(pk);
            });
        } else {
            // send message to nos2x extension to get the public key
            var pk = await chrome.runtime.sendMessage(
                nos2xId,
                {
                    type: 'getPublicKey',
                    params: {}
                }
            );
            setPk(pk);
        }
    }, []);

    const handleChange = (event) => {
        setContent(event.target.value);
    }

    const handleSubmit = async () => {
        let event = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['r', url]],
            content: content,
            id: null,
            pubkey: null
        }
        console.log(event);

        if (window.nostr) {
            event = await window.nostr.signEvent(event);
        } else {
            event = await chrome.runtime.sendMessage(
                nos2xId,
                {
                    type: 'signEvent',
                    params: {event}
                }
            );
        }
        console.log(event);
        publish(event);
    }

    return (
        <div>
            <div>Posting to nostr as: {pk}</div>
            <br />
            <label>
                Content:
                <br />
                <textarea value={content} onChange={handleChange} />
            </label>
            <br />
            <label>
                URL:
                <br />
                <input type="text" disabled value={url} />
            </label>
            <br />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}



