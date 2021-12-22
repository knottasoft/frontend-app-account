import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileList from './FileList';
import {Modal, CloseButton, Button, Form, FormControl} from "react-bootstrap";
import { useMediaQuery } from 'react-responsive'



export class DocumentCard extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleDelFile = this.handleDelFile.bind(this);
        this.getDocTitleOrDefault = this.getDocTitleOrDefault.bind(this);
        this.getDocumentStatus = this.getDocumentStatus.bind(this);
        this.getDocumentExpired = this.getDocumentExpired.bind(this);
        this.getValidationError= this.getValidationError.bind(this);

        this.state = {
            title: this.props.title,
            type: this.props.type,
            files: this.props.files,
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    handleAddFile(e) {
        const url = URL.createObjectURL(e);

        this.setState(prevState => ({
            files: [...prevState.files,
                {
                    isNewFile: true,
                    uploadedFile: e,
                    uploadedFileUri: url,
                }]
        }));
    }

    handleDelFile(e) {
        if (e.isNewFile) {
            this.setState(prevState => ({
                files: prevState.files.filter(el =>
                    el?.uploadedFile?.name !== e?.uploadedFile?.name)
            }));
        } else {
            const index = this.state.files.findIndex((obj => obj.id == e.id))
            let items = [...this.state.files];
            let item = {
                ...items[index],
                needDelete: true,
            }
            items[index] = item;
            this.setState({
                files: items,
            });
        }
    }

    handleSave() {
        const title = this.getDocTitleOrDefault()

        if (this.props.isNew) {
            const doc = {
                title: title,
                type: this.state.type,
                files: this.state.files.map((f) => f.uploadedFile)
            }
            this.props.onCreate(doc);
        }
        else {
            const idToDelete = this.state.files.reduce(function(result, file) {
                if (file.needDelete) {
                    return result.concat(file.id);
                }
                return result;
            }, []);

            const filesToCreate = this.state.files.reduce(function(result, file) {
                if (file.isNewFile) {
                    return result.concat(file.uploadedFile)
                }
                return result;
            },[]);

            const updateInfo = {
                id: this.props.id,
                title: title,
                type: this.state.type,
                files: filesToCreate,
                filesIdToDelete: idToDelete,
            }

            this.props.onUpdate(updateInfo);
        }
    }

    handleDelete() {
        console.log('handleDelete', this.props.id)
        
        if (this.props.isNew) {
            this.props.onClose();
        }
        else {
            this.props.onDelete(this.props.id);
        }
        
    }
    
    getDocTitleOrDefault()
    {
        if (this.state.title) {
            return this.state.title;
        }

        const selectedDocType = this.props.docTypes.find(x => x.value == this.state.type)
        return selectedDocType.label
    }

    getDocumentStatus() {
        if (this.props.isNew) {
            return null
        }
        
        let status = "На проверке"

        if (this.props.status == 'r') {
            status = "Проверка не пройдена"
        }

        if (this.props.status == 'v') {
            status = "Подтвержден"

            if (new Date(this.props.expiry_date) < Date.now()){
                status = "Истек срок действия документа"
            }
        }

        return (
            <div className="form-row px-3 mt-4">
                <label htmlFor="doc-status-id" className="mb-1">
                    <strong style={{ fontSize: 16 }}>Состояние: </strong> {status}
                </label>
            </div>
        )
    }

    getDocumentExpired() {
        if (this.props.status == 'v'){ // v-проверка пройдена
            return (
                <div className="form-row px-3 mt-4">
                    <label htmlFor="doc-expired-id" className="mb-1">
                        <strong style={{ fontSize: 16 }}>Действителен до:</strong> {this.props.expiry_date}
                    </label>
                </div>
            )
        }
    }

    getValidationError() {
        if (this.props.status == 'r'){ // r- возвращен, проверка не пройдена
            return (
                <div className="form-row px-3 mt-4">
                    <label htmlFor="doc-expired-id" className="mb-1">
                        <strong style={{ fontSize: 16 }}>Причина:</strong> {this.props.validation_error}
                    </label>
                </div>
            )
        }
    }

    render() {
        const noFiles = this.state.files.filter(file => !file.needDelete).length === 0

        const docType = this.props.docTypes.find(el => el.value === this.state.type)
        const isMobile = window.innerWidth < 768
        
        const docStatus = this.getDocumentStatus()
        const docExpired = this.getDocumentExpired()
        const docValidationError = this.getValidationError()

        return (
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={true}
                fullscreen={isMobile}
                onHide={this.props.onClose}
            >
                <Modal.Header className="bg-white">
                    <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: 22 }}>
                        📄 {this.props.isNew ? "Новый документ" : "Редактирование документа"}
                    </Modal.Title>
                    <CloseButton onClick={this.props.onClose} className="rounded-circle" style={{ backgroundColor: '#EBEBEF', color: '#553C8B' }} />
                </Modal.Header>
                <Modal.Body className="px-0 pb-4">
                    <div className="form-row px-3 mt-2">
                        <label htmlFor="doc-type-id" className="mb-1">
                            <strong style={{ fontSize: 16 }}>Тип документа</strong>
                        </label>
                        <Form.Select name="type" aria-label="Default select example" value={this.state.type} onChange={this.handleChange}>
                            <option>Выберите тип документа</option>
                            {this.props.docTypes.map(function(object, index){
                                return <option key={index} value={object.value}>{object.label}</option>
                            })}
                        </Form.Select>
                    </div>
                    <div className="form-row px-3 mt-4">
                        <label htmlFor="doc-title-id" className="mb-1">
                            <strong style={{ fontSize: 16 }}>Название документа</strong>
                        </label>
                        <FormControl
                            id="doc-title-id"
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                        <Form.Text muted style={{ fontSize: 14 }}>Необязательное поле</Form.Text>
                    </div>
                    {docStatus}
                    {docExpired}
                    {docValidationError}
                    <FileList
                        isNew={this.props.isNew}
                        description={docType?.description}
                        files={this.state.files}
                        onAdd={this.handleAddFile}
                        onDelete={this.handleDelFile}
                        isMobile={isMobile}
                    />
                </Modal.Body>
                <div className="px-0 pb-4">
                    <div className={"d-flex flex-row justify-content-start"}>
                        <div className="px-3">
                            <button className="btn btn-primary px-4 py-2"
                                    disabled={noFiles}
                                    style={{ fontSize: 16, lineHeight: '124%' }}
                                    onClick={this.handleSave}
                            >Сохранить документ
                            </button>
                        </div>
                        <div className="">
                            <button className="btn btn-outline-primary px-4 py-2"
                                    style={{ fontSize: 16, lineHeight: '124%' }}
                                    onClick={this.props.onClose}
                            >Отменить
                            </button>
                        </div>
                        {this.props.isNew ? null
                            :  <div className="px-3 flex-grow-1 d-flex justify-content-end">
                                <button className="btn btn-outline-danger px-4 py-2"
                                        style={{ fontSize: 16, lineHeight: '124%' }}
                                        onClick={this.handleDelete}
                                >Удалить
                                </button>
                        </div>}
                    </div>
                </div>

            </Modal>
        );
    };
}

DocumentCard.propTypes = {
    isOpen: PropTypes.bool,
    isNew: PropTypes.bool,
    id: PropTypes.number,
    title: PropTypes.string,
    type: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.object),
    docTypes: PropTypes.arrayOf(PropTypes.object),
    status: PropTypes.string,
    expiry_date: PropTypes.string,
    validation_error: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

DocumentCard.defaultProps = {
    isOpen: false,
    isNew: true,
    title: null,
    type: null,
    files: [],
    docTypes: [],
    status: 'n',
};

export default DocumentCard;

const CardStyle = {
    width: "800px",
    heigth: "500px",
}
