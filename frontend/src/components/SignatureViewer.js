import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import PreviousSearches from './PreviousSearches';
import File from './File';
import {getRequest} from '../helpers/HttpHelper';
import config from '../../config.json';


class SignatureViewer extends React.Component {
    state = {
        files: [],
        previousSearches: []
    }

    handleSearch = (description) => {
        const url = `${config.api.url}/search/${description}`;
        return getRequest(url)
            .then((result) => {
                this.setState((prevState) => {
                    let newPreviousStates = prevState.previousSearches;
                    newPreviousStates.unshift(result.data[0].description);
                    newPreviousStates = newPreviousStates.slice(0, 10);
                    return { files: result.data, previousSearches: newPreviousStates};
                });
            })
            .catch(() => {
                this.setState(() => ({ files: [] }))
                throw new Error('Could not find a file containing that description.');
            });
    }

    handleClearFile = (fileName) => {
        this.state.files.forEach((file, index) => {
            if (file.fileName === fileName) {
                let updatedFilesArray = this.state.files;
                updatedFilesArray.splice(index, 1);

                this.setState(() => ({
                    files: updatedFilesArray
                }));
            }
        });
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
                {this.state.files.length > 0 && <p className="signature-viewer__p">Search found {this.state.files.length} result{this.state.files.length > 1 ? 's' : ''}.</p>}
                <div className="search-results">
                    {this.state.previousSearches.length > 0 && <PreviousSearches handleSearch={this.handleSearch} previousSearches={this.state.previousSearches}/>}
                    {this.state.files.map((file, index) => (
                        <File key={index} fileContents={file.fileContents} fileName={file.fileName} handleClearFile={this.handleClearFile}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default SignatureViewer;