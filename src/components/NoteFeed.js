import {
    useEffect,
    useState
} from 'react';
import { getCurrentUrl } from '../utils';

import { Note } from './Note';


export default function NoteFeed() {
    const [url, setUrl] = useState('');
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getCurrentUrl().then(newUrl => {
            setUrl(newUrl);
            // send message to background script to get events for current url
            chrome.runtime.sendMessage(
                { type: 'updateEventsForUrl', url: newUrl },
                function(response) {
                    console.log(response);
                }
            );
            chrome.storage.local.get(newUrl, function(result) {
                setEvents(result[newUrl].events);
            });
        });
    }, []);

    useEffect(() => {
        chrome.storage.onChanged.addListener(function(changes, namespace) {
            // if the key is the current url, update the events
            if (changes[url]) {
                setEvents(changes[url].newValue.events);
            }
        });
    }, []);

    return (
        <div>
        {events.map(event => (
            <Note key={event.id} event={event} url={url} />
        ))}
        </div>
    );
}
