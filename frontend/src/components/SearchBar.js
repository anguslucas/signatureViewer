import React from 'react';

class SearchBar extends React.Component {
    state = {
        error: undefined,
        searchTerm: ''
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState(() =>  ({ searchTerm: value }));
    }

    handleSearch = (e) => {
        e.preventDefault();
        const description = e.target.elements.search.value.trim();
        this.setState(() => ({ searchTerm: '' }))
        this.props.handleSearch(description)
            .catch((err) => {
                this.setState(() => ({
                    error: err
                }))
            })
    }

    render() {
        return (
            <div>
                {this.state.error && <p className="search-bar-error">{this.state.error}</p>}
                <form className="search-bar" onSubmit={this.handleSearch}>
                    <input className="search-bar__input" type="text" name="search" value={this.state.searchTerm} onChange={this.handleChange} />
                    <button className="search_button" disabled={!this.state.searchTerm}>Search</button>
                </form>
            </div>
        )
    }
}

export default SearchBar;