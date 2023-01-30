import React, { Component } from 'react';

class Url extends Component {
    constructor(props) {
        super(props);
        this.state = { url: '' };
    }

    componentDidMount() {
        getCurrentUrl().then(url => {
            this.setState({ url: url });
        });

    }

    render() {
        return (
            <div>{this.state.url}</div>
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

export default Url;