import React from 'react';

class File extends React.Component {
    handleClearFile = () => {
        this.props.handleClearFile(this.props.fileName);
    }

    render() {
        return (
            <div className="file">
                <div className="file__header">
                    <h2 className="file__h2">{this.props.fileName}</h2>
                    <button className="clear_button" onClick={this.handleClearFile}>clear</button>
                </div>
                <p className="file__text">{this.props.fileContents}</p>
            </div>
        )
    }
}

export default File;