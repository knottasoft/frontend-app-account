import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal, Button, Input } from "@edx/paragon";
import FileList from './FileList';

export class DocumentCard extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleDelFile = this.handleDelFile.bind(this);

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
                    el.uploadedFile.name !== e.uploadedFile.name)
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
        if (this.props.isNew) {
            const doc = {
                title: this.state.title,
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
                title: this.state.title,
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

    render() {
        const docType = this.props.docTypes.find(el => el.value == this.state.type)

      return (
        <Modal 
            title={this.props.isNew ? "Новый документ" : "Редактирование документа"}
            open={true}
            onClose={this.props.onClose} 
            renderDefaultCloseButton={false}
            size="lg"
            dialogClassName="modal-90vw"
            style={CardStyle}
            body={(
            <div
            >
                <label htmlFor="doc-type-id" className="font-weight-bold">
                    Тип документа
                </label>
                <Input 
                    id="doc-type-id"
                    type="select" 
                    name="type"
                    options={this.props.docTypes}
                    value={this.state.type}
                    onChange={this.handleChange} 
                />
                <label htmlFor="doc-title-id" className="font-weight-bold">
                    Название документа
                </label>
                <Input 
                    id="doc-title-id"
                    type="text" 
                    name="title"
                    value={this.state.title}
                    onChange={this.handleChange}   
                />
                <FileList
                    description={docType?.description}
                    files={this.state.files}
                    onAdd={this.handleAddFile}
                    onDelete={this.handleDelFile}
                />
            </div>)}
            buttons={[
                <Button onClick={this.handleSave}>
                    Сохранить
                </Button>,
                <Button onClick={this.props.onClose}>
                    Закрыть
                </Button>,
                <Button variant="danger" onClick={this.handleDelete}>
                    Удалить
                </Button>,
              ]}
        ></Modal> 
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
};
  
export default DocumentCard;

const CardStyle = {
    width: "800px",
    heigth: "500px",
}