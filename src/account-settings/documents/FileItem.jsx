import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';


class FileItem extends React.Component {
    constructor(props) {
        super(props);

    }

    render () {
        const imageSrc = this.props.file.isNewFile ?
            this.props.file.uploadedFileUri :
            this.props.file.thumbnail

        return (
            <div className={"ms-3 my-3 position-relative"}>
                <img src={imageSrc} style={FileItemImageStyle} className={"border border-black"}/>
                <span className={"position-absolute top-0 start-100 translate-middle rounded-circle"}>
                    <FontAwesomeIcon
                        onClick={_ => {this.props.onDelete(this.props.file)}}
                        icon={faTimesCircle}
                        style={IconStyle}
                    />
                </span>
            </div>
        );
    }
}

FileItem.propTypes = {
    file: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    index: PropTypes.number
};

FileItem.defaultProps = {
    file: {}
};

export default FileItem;

const CardBodyStyle = {
    padding: "0",
}

const FileItemImageStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    objectFit: 'cover',
    zIndex: 1,
};

// const ButtonStyle = {
//     position: "absolute",
//     right: "-12px",
//     top: "-12px",
//     padding: "0",
// }

const IconStyle = {
    background: "white",
    color: "#D01F28",
    borderRadius: "8px"
}
