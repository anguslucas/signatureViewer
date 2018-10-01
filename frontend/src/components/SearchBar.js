import React from 'react';

class SearchBar extends React.Component {
    state = {
        error: undefined,
        filesCount: 0,
        searchTerm: ''
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState(() =>  ({ searchTerm: value }));
    }

    handleSearch = (e) => {
        e.preventDefault();
        const description = e.target.elements.search.value.trim();
        this.props.handleSearch(description)
            .then((filesCount) => this.setState(() => ({ error: '', searchTerm: '', filesCount })))
            .catch((err) => this.setState(() => ({ error: err.message, filesCount: 0 })))
    }

    render() {
        return (
            <div>
                {this.state.error && <p className="search-bar-message">{this.state.error}</p>}
                {this.state.filesCount > 0 && <p className="search-bar-message">Search found {this.state.filesCount} result{this.state.filesCount > 1 ? 's' : ''}.</p>}
                <form className="search-bar" onSubmit={this.handleSearch}>
                    <input className="search-bar__input" type="text" name="search" value={this.state.searchTerm} onChange={this.handleChange} />
                    <button className="search_button" disabled={!this.state.searchTerm}>Search</button>
                </form>
            </div>
        )
    }
}

export default SearchBar;