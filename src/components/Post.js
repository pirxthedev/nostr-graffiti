import React, { Component } from 'react';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { getCurrentUrl, postNote } from '../utils';

let sk = generatePrivateKey() // `sk` is a hex string
let pk = getPublicKey(sk) // `pk` is a hex string

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            content: 'test',
            relays: ['wss://brb.io'],
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
        postNote(
            this.state.relays,
            this.state.sk,
            this.state.pk,
            this.state.url,
            this.state.content
        );
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

export default Post;