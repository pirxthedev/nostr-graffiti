import React, { Component } from 'react';
import { relayInit } from 'nostr-tools';
import { getCurrentUrl } from '../utils';

class NoteFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            notes: [],
            relays: ['wss://nostr.zebedee.cloud']
        };
    }

    componentDidMount() {
        getCurrentUrl().then(url => {
            this.setState({ url: url });
        });

        this.getNotes();
    }

    async getNotes() {
        const relay = relayInit(this.state.relays[0]);
        await relay.connect();

        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })
        let sub = relay.sub([
            {
                "kinds": [1],
                "limit": 10,
                "#r": [this.state.url]
            }
        ])

        sub.on('event', event => {
            this.setState(prevState => (
                {notes: [...prevState.notes, event]}
            ));
        })
        sub.on('eose', () => {
            sub.unsub()
        })
    }

    render() {
        return (
            <div>
                <div>{this.state.url}</div>
                <div>{this.state.relays}</div>
                {this.state.notes.map(note => (
                    <div key={note.id}>{note.content}</div>
                ))}
            </div>
        );
    }
}


export default NoteFeed;