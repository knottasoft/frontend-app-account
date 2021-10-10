import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image, Icon } from '@edx/paragon';
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
            <Card 
                className="m-3"
            >
                <Card.Body style={CardBodyStyle}>                
                    <div>
                        <Image src={imageSrc} rounded style={FileItemImageStyle}/>                       
                        <Button 
                            variant="link" 
                            style={ButtonStyle} 
                            onClick={_ => {this.props.onDelete(this.props.file)}} 
                        >
                            <FontAwesomeIcon 
                                className="mr-1" 
                                icon={faTimesCircle} 
                                style={IconStyle}/>
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

FileItem.propTypes = {
    file: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
};

FileItem.defaultProps = {
    file: {}
};

export default FileItem;

const CardBodyStyle = {
    padding: "0",
}

const FileItemImageStyle = {
    'width': '80px',
    'height': '80px',
};

const ButtonStyle = {
    position: "absolute",
    right: "-12px",
    top: "-12px",
    padding: "0",
}

const IconStyle = {
    background: "white",
    color: "#D01F28",
    "border-radius": "8px",
}
