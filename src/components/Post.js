import {generatePrivateKey, getPublicKey} from 'nostr-tools'
import React, { Component } from 'react';

let sk = generatePrivateKey() // `sk` is a hex string
let pk = getPublicKey(sk) // `pk` is a hex string

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            content: 'default content',
            relays: ['wss://nostr.zebedee.cloud'],
            sk: sk,
            pk: pk
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        getCurrentUrl().then(url => {
            this.setState({ url: url });
        });

    }

    handleChange(event) {
        this.setState({content: event.target.value});
    }

    handleSubmit(event) {
        alert('Posting to nostr: ' + this.state.content);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div>Posting to nostr as: {this.state.pk}</div>
                <br />
                <form onSubmit={this.handleSubmit}>
                <label>
                    Content:
                    <br />
                    <textarea value={this.state.content} onChange={this.handleChange} />
                </label>
                <br />
                <label>
                    URL:
                    <br />
                    <input type="text" disabled value={this.state.url} />
                </label>
                <br />
                <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

async function getCurrentUrl() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let url = '';
    try {
        let [tab] = await chrome.tabs.query(queryOptions);
        url = tab.url;
    } catch (error) {
        console.log("Not running as a Chrome extension. Fallback to URL of current page.");
        url = window.location.href;
    }
    return url;
}


export default Post;