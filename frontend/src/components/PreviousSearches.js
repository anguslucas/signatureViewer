import React from 'react';

class PreviousSearches extends React.Component {
    handleSearch (description) {
        this.props.handleSearch(description)
            .catch();
    }

    render () {
        return (
            <div className="previous-searches-box">
                <h3 className="previous-searches__h3">Previous Searches</h3>
                <ol>
                    {this.props.previousSearches.map((search, index) => 
                        <li className="previous-searches__li" onClick={() => this.handleSearch(search)} key={index}>{search}</li>
                    )}
                </ol>
            </div>
        )
    }
}

export default PreviousSearches;