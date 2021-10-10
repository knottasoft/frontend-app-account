import React from 'react';
import PropTypes from 'prop-types';
import { CardDeck } from '@edx/paragon';
import FileUploader from './FileUploader';
import FileItem from './FileItem';

class FileList extends React.Component {
    constructor(props) {
        super(props);
    }

    getFiles(files) {
        return files.map((f) => 
            f.needDelete ? null :
            <FileItem 
                style={FileItemStyle}
                key={ f.isNewFile ? 
                    f.uploadedFileUri : 
                    f.thumbnail}
                file={f}
                onDelete={this.props.onDelete}
            />
        )
    }

    render() {
        const files = this.getFiles(this.props.files);
        const description = this.props.description
        return (
        <div>
            <div>{ description }</div>
            <div className="my-2 row">
                { files }
            </div>
            <FileUploader 
                handleFile={this.props.onAdd}   
                />
        </div>
        )
    }
}

FileList.propTypes = {
    description: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.object),
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

FileList.defaultProps = {
    description: '',
    files: []
};

export default FileList;

const FileItemStyle = {
    padding: "0",
}