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
            {events.map(event => (
                <p><div key={event.id}>{event.content.replace(url, '')}</div></p>
            ))}
        </div>
    );
}
