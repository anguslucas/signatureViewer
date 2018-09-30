import React from 'react';

const File = (props) => (
    <div className="file">
        <div>
            <h2 className="file__h2">{props.fileName}</h2>
        </div>
        <p className="file__text">{props.fileContents}</p>
    </div>
)

export default File;