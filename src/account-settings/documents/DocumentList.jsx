import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import DocumentItem from './DocumentItem'
import { Button, CardGroup } from '@edx/paragon';
// Actions
import {
    studentDocumentCardAdd,
    studentDocumentCardClose,
    studentDocumentCardEdit,
    getStudentDocuments,
    createStudentDocument,
    updateStudentDocument,
    deleteStudentDocument,
  } from './data/actions';
import DocumentCard from './DocumentCard';

class DocumentList extends React.Component {
    constructor(props) {
        super(props);

        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleCreate(e) {
        console.log("handleCreate", e);
        this.props.createStudentDocument(
            {
                name: e.title,
                description: e.type,
                files: e.files,
        })
    };

    handleDelete(e) {
        this.props.deleteStudentDocument(e)
    };

    handleEditButton(e){
        this.props.studentDocumentCardEdit(e);
    };

    handleUpdate(e) {
        this.props.updateStudentDocument(e);
    }

    getDocuments(documents) {
        return documents.map((doc) => 
            <DocumentItem 
                key={doc.id}
                document={doc} 
                onClick={this.handleEditButton}
            />);
    };

    render() {
        const docs = this.getDocuments(this.props.documents);
        const isOpen = this.props.card != null;

        return (
            <div>
                <h4>Документы (component)</h4>
                <div
                    className="m-3 row"
                >
                    { docs }
                </div>
                <Button
                    onClick={this.props.studentDocumentCardAdd}
                >
                    Добавить документ
                </Button>

                { (isOpen) ? 
                    <DocumentCard
                        isNew={this.props.card.isNew}
                        id={this.props.card?.id}
                        title={this.props.card?.title}
                        type={this.props.card?.type}
                        files={this.props.card?.files}
                        docTypes={this.props.docTypes}
                        onClose={this.props.studentDocumentCardClose}
                        onCreate={this.handleCreate}
                        onDelete={this.handleDelete}
                        onUpdate={this.handleUpdate}
                    />
                : null
                }
            </div>
        );
    }
}

DocumentList.propTypes = {
    intl: intlShape.isRequired,
    getStudentDocuments: PropTypes.func.isRequired,
    studentDocumentCardAdd: PropTypes.func.isRequired,
    studentDocumentCardClose: PropTypes.func.isRequired,
    studentDocumentCardEdit: PropTypes.func.isRequired,
    createStudentDocument: PropTypes.func.isRequired,
    updateStudentDocument: PropTypes.func.isRequired,
    deleteStudentDocument: PropTypes.func.isRequired,
    status: PropTypes.oneOf(['pending','loaded','failed']),
    documents: PropTypes.arrayOf(PropTypes.object),
    card: PropTypes.object,
    docTypes: PropTypes.arrayOf(PropTypes.object),
};

DocumentList.defaultProps = {
    status: null,
    documents: [],
    card: null,
    docTypes:[],
};

const mapStateToProps = (state) => state.accountSettings.studentDocuments

export default connect(
    mapStateToProps,
    {
        studentDocumentCardAdd,
        studentDocumentCardClose,
        studentDocumentCardEdit,
        getStudentDocuments,
        createStudentDocument,
        updateStudentDocument,
        deleteStudentDocument,
    },
)(injectIntl(DocumentList));

const DocumentListStyle = {
    magin: '24px 0 24 px 0',
}

