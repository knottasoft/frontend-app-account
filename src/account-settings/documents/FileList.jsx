import React from 'react';
import PropTypes from 'prop-types';
import FileUploader from './FileUploader';
import FileItem from './FileItem';
import iconInfo from "../../assets/icon-info.svg";
import {isMobile} from "@tensorflow/tfjs-core/dist/device_util";
import DocumentItem from "./DocumentItem";

class FileList extends React.Component {
    constructor(props) {
        super(props);
    }

    getFiles(files, hasFiles) {
        let count = 10

        if (this.props.isMobile) {
            count = 4
        }

        const rows = files.reduce(function (rows, key, index) {
            return (index % count === 0 ? rows.push([key])
                : rows[rows.length-1].push(key)) && rows;
        }, []);

        const showFileUploader = (current_row, preview_row, index) => {
            let fileUploader = null
            if (isMobile){
                if (index > 0 && preview_row.length === count){
                    fileUploader =  <FileUploader
                                hasFiles={!hasFiles}
                                handleFile={this.props.onAdd}
                            />
                } else {
                    fileUploader = null
                }

                if (index === 0 && current_row.length < count) {
                    fileUploader = <FileUploader
                        hasFiles={!hasFiles}
                        handleFile={this.props.onAdd}
                    />
                } else {
                    fileUploader = null
                }
            }

            return fileUploader
        }

        return rows.map((row, index) => (
            <>
                <div className="d-flex flex-row justify-content-start">
                    {
                        row.map((f, i) =>
                            f.needDelete ? null :
                                <FileItem
                                    index={i}
                                    key={ f.isNewFile ?
                                        f.uploadedFileUri :
                                        f.thumbnail }
                                    file={f}
                                    onDelete={this.props.onDelete}
                                />
                        )
                    }
                    {
                        showFileUploader(row, rows[index-1], index)
                    }

                </div>
            </>

        ));
    }

    render() {
        const length = this.props.files.filter(file => !file.needDelete).length
        const hasFiles = length === 0
        const files = this.getFiles(this.props.files, hasFiles);
        const description = this.props.description

        return (
        <>
            {  !hasFiles ?
                <>
                <div className="bg-light border-color px-0 mt-4" style={{ borderColor: '#EBEBEF', borderStyle: 'solid', borderWidth: '1px 1px' }}>
                    { files }
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
                    <div className="bg-light border-color px-0" style={{ border: '1px solid #EBEBEF' }}>
                        <ul className="list-inline d-flex align-items-center mt-4 mx-3 py-2 d-flex align-items-center">
                            <li className="list-inline-item">
                                <FileUploader
                                    handleFile={this.props.onAdd}
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
                            {/*<li className="list-inline-item mx-3">*/}
                            {/*    <div className="align-self-center">*/}
                            {/*        <p className="text-secondary p-0 m-0 h" style={{ fontSize: 14 }}>Максимальные размер файла - 10 MB.</p>*/}
                            {/*        <p className="text-secondary" style={{ fontSize: 14 }}>Вы можете загрузить не более 10 файлов для одного документа.</p>*/}
                            {/*    </div>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </> : null
            }
            {/*<FileUploader*/}
            {/*    handleFile={this.props.onAdd}*/}
            {/*    />*/}
        </>
        )
    }
}

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
    isMobile: false
};

export default FileList;
