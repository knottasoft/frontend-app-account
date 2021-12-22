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
import DocumentCardMobile from "./mobile/DocumentCardMobile";
import Responsive from "react-responsive";
import MobileAccountSettingsPage from "../MobileAccountSettingsPage";
import DesktopAccountSettingsPage from "../DesktopAccountSettingsPage";

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
                student_fio: this.props.student_fio,
        })
    };

    handleDelete(e) {
        this.props.deleteStudentDocument(e)
    };

    handleEditButton(e){
        this.props.studentDocumentCardEdit(e);
    };

    handleUpdate(e) {
        this.props.updateStudentDocument({
            ...e,
            student_fio: this.props.student_fio,
        });
    }

    getDocuments(documents) {
        return documents.map((doc) =>
            <DocumentItem
                key={doc.id}
                document={doc}
                onClick={this.handleEditButton}
            />);
    };

    // getDocuments(documents) {


        // let count = 3
        //
        // if (window.innerWidth >= 1700 ) {
        //     count = 4
        // } else if (window.innerWidth < 1600 && window.innerWidth > 768 ) {
        //     count = 3
        // } else if (window.innerWidth < 768) {
        //     count = 1
        // }
        //
        // const rows = documents.reduce(function (rows, key, index) {
        //     return (index % count === 0 ? rows.push([key])
        //         : rows[rows.length-1].push(key)) && rows;
        // }, []);



        // return rows.map(row => (
        //     <div className="row">
        //         <div className={count === 1 ? "" : "hstack gap-5"} >
        //             { row.map(doc => (<DocumentItem
        //                 key={doc.id}
        //                 document={doc}
        //                 onClick={this.handleEditButton}
        //             />)) }
        //         </div>
        //
        //     </div>
        // ));
    // };

    render() {
        const docs = this.getDocuments(this.props.documents);
        const isOpen = this.props.card != null;

        return (
            <div>
                <div className="d-flex flex-wrap">
                    { docs }
                </div>
                <Button
                    className="mt-2"
                    onClick={this.props.studentDocumentCardAdd}
                >
                    Добавить документ
                </Button>


                { (isOpen) ?
                    <>
                        <Responsive maxWidth={768}>
                            <DocumentCardMobile
                                isNew={this.props.card.isNew}
                                id={this.props.card?.id}
                                title={this.props.card?.title}
                                type={this.props.card?.type}
                                files={this.props.card?.files}
                                docTypes={this.props.docTypes}
                                status={this.props.card?.status}
                                expiry_date={this.props.card?.expiry_date}
                                validation_error={this.props.card?.validation_error}
                                onClose={this.props.studentDocumentCardClose}
                                onCreate={this.handleCreate}
                                onDelete={this.handleDelete}
                                onUpdate={this.handleUpdate}
                            />
                        </Responsive>
                        <Responsive minWidth={769}>
                            <DocumentCard
                                isNew={this.props.card.isNew}
                                id={this.props.card?.id}
                                title={this.props.card?.title}
                                type={this.props.card?.type}
                                files={this.props.card?.files}
                                docTypes={this.props.docTypes}
                                status={this.props.card?.status}
                                expiry_date={this.props.card?.expiry_date}
                                validation_error={this.props.card?.validation_error}
                                onClose={this.props.studentDocumentCardClose}
                                onCreate={this.handleCreate}
                                onDelete={this.handleDelete}
                                onUpdate={this.handleUpdate}
                            />
                        </Responsive>
                    </>
                : null
                }
            </div>
        );
    }
}

DocumentList.propTypes = {
    student_fio: PropTypes.string,
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
