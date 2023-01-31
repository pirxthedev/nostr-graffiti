import { useState, useEffect } from 'react';
import {
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent
} from 'nostr-tools'
import { useNostr } from 'nostr-react';
import { getCurrentUrl } from '../utils';


export default function Post() {
    const [content, setContent] = useState('test');
    const [url, setUrl] = useState('');
    const [sk, setSk] = useState(generatePrivateKey());
    const [pk, setPk] = useState(getPublicKey(sk));
    const { publish } = useNostr();

    useEffect(() => {
        getCurrentUrl().then(url => {
            setUrl(url);
        });
    }, []);

    const handleChange = (event) => {
        setContent(event.target.value);
    }

    const handleSubmit = async (submit_event) => {
        let event = {
            kind: 1,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['r', url]],
            content: content
        }
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);

        publish(event);

        submit_event.preventDefault();
    }

    return (
        <div>
            <div>Posting to nostr as: {pk}</div>
            <br />
            <form onSubmit={handleSubmit}>
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
            <input type="submit" value="Submit" />
            </form>
        </div>
    );
}



