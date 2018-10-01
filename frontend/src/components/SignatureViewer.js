import React from 'react';
import Promise from 'bluebird';
import Header from './Header';
import SearchBar from './SearchBar';
import File from './File';
import {getRequest} from '../helpers/HttpHelper';
import config from '../../config.json';


class SignatureViewer extends React.Component {
    state = {
        files: []
    }

    handleSearch = (description) => {
        const url = `${config.api.url}/search/${description}`;
        return getRequest(url)
            .then((result) => {
                this.setState(() => ({ files: result.data }))
                return this.state.files.length;
            })
            .catch(() => {
                this.setState(() => ({ files: [] }))
                throw new Error('Could not find a file containing that description.');
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
                    {this.state.files.map((file, index) => (
                        <File key={index} fileContents={file.fileContents} fileName={file.fileName}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default SignatureViewer;