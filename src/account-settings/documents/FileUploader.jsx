import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "@edx/paragon";

class FileUploader extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleClick () {
        this.refs.fileUploader.click();
    };

    handleChange (event) {
        const fileUploaded = event.target.files[0];
        this.props.handleFile(fileUploaded);
    };

    render() {
        return (
            <div>
                <Button onClick={this.handleClick}>
                +
                </Button>
                <input 
                    type="file"
                    accept="image/*"
                    ref="fileUploader"
                    onChange={this.handleChange}
                    style={{display:'none'}} 
                /> 
            </div>
        )
    }
}

FileUploader.propTypes = {
    handleFile: PropTypes.func
};

export default FileUploader;