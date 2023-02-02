import {
    useEffect,
    useState
} from 'react';
import { useNostrEvents } from 'nostr-react';
import { getCurrentUrl } from '../utils';


export default function NoteFeed() {
    const [url, setUrl] = useState('');
    const { events } = useNostrEvents({
        'filter': {
            'kinds': [1],
            '#r': [url],
            'since': 0
        }
    });

    useEffect(() => {
        getCurrentUrl().then(url => {
            setUrl(url);
        });
    }, []);

    return (
        <div>
            <div>Nostr posts about {url}</div>
            {events.map(event => (
                <div key={event.id}>{event.content}</div>
            ))}
        </div>
    );
}
