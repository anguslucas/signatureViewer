import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import {getRequest} from '../helpers/HttpHelper';


class SignatureViewer extends React.Component {
    state = {
        fileContents: ''
    }

    handleSearch = (description) => {
        const url = `http://127.0.0.1:9999/search/${description}`;
        return getRequest(url)
            .then((result) => {
                this.setState(() => ({
                    fileContents: result.data
                }))
            })
    }

    render() {
        const title = 'Cuckoo Signature Viewer'
        const subtitle = 'Search for Cuckoo signatures by description';

        return (
            <div>
                <Header title={title} subtitle={subtitle}/>
                <div className="container">
                    <SearchBar handleSearch={this.handleSearch}/>
                </div>
                <div>
                    {this.state.fileContents && <p>{this.state.fileContents}</p>}
                </div>
            </div>
        )
    }
}

export default SignatureViewer;