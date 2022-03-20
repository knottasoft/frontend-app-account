import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-bootstrap";
import { ReactComponent as IconUpload } from "../../assets/icon-upload.svg";
import { ReactComponent as IconPlus } from "../../assets/icon-plus.svg";

class FileUploader extends React.Component {
    constructor(props) {
        super(props);

        this.fileUploaderRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick () {
        this.fileUploaderRef.current.click();
    };

    handleChange (event) {
        const fileUploaded = event.target.files[0];
        this.props.handleFile(fileUploaded);
    };

    render() {
        return (
                !this.props.hasFiles ?
                <>
                    <button className="btn btn-outline-primary btn-sm p-2 px-4 d-flex flex-row align-items-center brand-icon" onClick={this.handleClick}>
                        <IconUpload className="me-1" />
                        {/*<img className="d-block me-2 svg" src={iconUpload} alt={"..."} />*/}
                        <span className="me-2" style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 500, lineHeight: '124%' }}>Загрузить изображения</span>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={this.fileUploaderRef}
                        onChange={this.handleChange}
                        style={{display:'none'}}
                    />
                </> :
                <>
                    <button
                        className={"btn btn-outline-primary m-3 justify-content-center align-items-center brand-icon"}
                        style={{ width: 60, height: 60, borderRadius: 4, border: '2px solid #553C8B' }}
                        onClick={this.handleClick}
                    >
                        <IconPlus />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={this.fileUploaderRef}
                        onChange={this.handleChange}
                        style={{display:'none'}}
                    />
                </>

        )
    }
}

FileUploader.propTypes = {
    handleFile: PropTypes.func,
    isOnBoarding: PropTypes.bool
};

FileUploader.defaultProps = {
    hasFiles: false
}

export default FileUploader;
