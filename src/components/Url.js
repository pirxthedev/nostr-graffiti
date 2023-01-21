import React, { Component } from 'react';

class Url extends Component {
    constructor(props) {
        super(props);
        this.state = { url: '' };
    }

    componentDidMount() {
        getCurrentTab().then(tab => {
            this.setState({ url: tab.url });
        });
    }

    render() {
        return (
            <div>{this.state.url}</div>
        );
    }
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

export default Url;