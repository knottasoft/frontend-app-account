import React from 'react';
import PropTypes from 'prop-types';
import FileUploader from './FileUploader';
import FileItem from './FileItem';
import iconInfo from "../../assets/icon-info.svg";

class FileList extends React.Component {
    constructor(props) {
        super(props);
    }

    getFiles(files) {
        return files.map((f) =>
            f.needDelete ? null :
                <FileItem
                    key={ f.isNewFile ?
                        f.uploadedFileUri :
                        f.thumbnail}
                    file={f}
                    onDelete={this.props.onDelete}
                />
        )
    }


    render() {
        const length = this.props.files.filter(file => !file.needDelete).length
        const hasFiles = length === 0
        const files = this.getFiles(this.props.files, hasFiles);
        const description = this.props.description
        let count = 10

        return (
        <>
            {  !hasFiles ?
                <>
                <div className="bg-light border-color px-0 mt-4" style={{ borderColor: '#EBEBEF', borderStyle: 'solid', borderWidth: '1px 1px' }}>
                    <div className="d-flex flex-row flex-wrap justify-content-start">
                        { files }
                        { files.length === count ? null : <FileUploader hasFiles={!hasFiles} handleFile={this.props.onAdd} /> }
                    </div>

                </div>
                <span className={"ms-3 text-muted"} style={{ fontSize: 14 }}>Не более 10 файлов</span></> :
                description ?
                <>
                    <div className="bg-light border-color px-0 mt-4" style={{ borderColor: '#EBEBEF', borderStyle: 'solid', borderWidth: '1px 1px' }}>
                        <ul className="list-inline d-flex align-items-center mt-4 mx-3 py-2">
                            <li className="list-inline-item"><img src={iconInfo} alt={null} /></li>
                            <li className="list-inline-item"><li className="list-inline-item">
                                { description }
                            </li></li>
                        </ul>
                    </div>
                    <FileInitContainer isMobile={this.props.isMobile} onAdd={this.props.onAdd} />
                </> : null
            }
        </>
        )
    }
}

const FileInitContainer = ({ isMobile, onAdd }) => {
    if (isMobile) {
        return (
            <div className="bg-light border-color px-0" style={{ border: '1px solid #EBEBEF' }}>
                <div className="d-flex flex-column mx-5 my-4 align-items-center">
                    <FileUploader
                        handleFile={onAdd}
                    />
                    <div className="d-flex flex-column justify-content-center mx-2">
                        <p className="text-secondary text-center mt-2 mb-1" style={{fontSize: 14}}>
                            Максимальные размер файла- 10 MB.
                        </p>
                        <p className="text-secondary text-center my-0" style={{fontSize: 14}}>
                            Вы можете загрузить не более 10 файлов для одного документа.
                        </p>
                    </div>

                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-light border-color px-0" style={{ border: '1px solid #EBEBEF' }}>
                <ul className="list-inline d-flex align-items-center mt-4 mx-3 py-2 d-flex align-items-center">
                    <li className="list-inline-item">
                        <FileUploader
                            handleFile={onAdd}
                        />
                    </li>
                    <div className="d-flex flex-column justify-content-center mx-2">
                        <p className="text-secondary p-0 m-0 h" style={{fontSize: 14}}>
                            Максимальные размер файла- 10 MB.
                        </p>
                        <p className="text-secondary my-0" style={{fontSize: 14}}>
                            Вы можете загрузить не более 10 файлов для одного документа.
                        </p>
                    </div>
                </ul>
            </div>
        )
    }
}

FileInitContainer.propTypes = {
    onAdd: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
};


FileList.propTypes = {
    isNew: PropTypes.bool,
    description: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.object),
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
};

FileList.defaultProps = {
    description: '',
    files: [],
};

export default FileList;
