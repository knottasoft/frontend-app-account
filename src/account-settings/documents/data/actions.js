import { AsyncActionType } from '../../data/utils';

export const GET_STUDENT_DOCUMENTS = new AsyncActionType('ACCOUNT_SETTINGS', 'GET_STUDENT_DOCUMENTS');
export const GET_STUDENT_DOCUMENT_TYPES = new AsyncActionType('ACCOUNT_SETTINGS', 'GET_STUDENT_DOCUMENT_TYPES');
export const CREATE_STUDENT_DOCUMENT = new AsyncActionType('ACCOUNT_SETTINGS', 'CREATE_STUDENT_DOCUMENT');
export const UPDATE_STUDENT_DOCUMENT = new AsyncActionType('ACCOUNT_SETTINGS', 'UPDATE_STUDENT_DOCUMENT');
export const DELETE_STUDENT_DOCUMENT = new AsyncActionType('ACCOUNT_SETTINGS', 'DELETE_STUDENT_DOCUMENT');

export const STUDENT_DOCUMENT_CARD_ADD = 'STUDENT_DOCUMENT_CARD_ADD';
export const STUDENT_DOCUMENT_CARD_CLOSE = 'STUDENT_DOCUMENT_CARD_CLOSE'
export const STUDENT_DOCUMENT_CARD_EDIT = 'STUDENT_DOCUMENT_CARD_EDIT'


export const getStudentDocuments = () => ({
    type: GET_STUDENT_DOCUMENTS.BASE,
});

export const getStudentDocumentsBegin = () => ({
    type: GET_STUDENT_DOCUMENTS.BEGIN,
});

export const getStudentDocumentsSuccess = documents => ({
    type: GET_STUDENT_DOCUMENTS.SUCCESS,
    payload: { documents }
});

export const getStudentDocumentsFailure = reason => ({
    type: GET_STUDENT_DOCUMENTS.FAILURE,
    payload: { reason },
});
// to clear errors from the confirmation modal
export const getStudentDocumentsReset = () => ({
    type: GET_STUDENT_DOCUMENTS.RESET,
  });



export const studentDocumentCardAdd = () => ({
    type: STUDENT_DOCUMENT_CARD_ADD,
});

export const studentDocumentCardClose = () => ({
    type: STUDENT_DOCUMENT_CARD_CLOSE,
});
export const studentDocumentCardEdit = document => ({
    type: STUDENT_DOCUMENT_CARD_EDIT,
    payload: { document },
});


export const createStudentDocument = document => ({
    type: CREATE_STUDENT_DOCUMENT.BASE,
    payload: { document },
});

export const createStudentDocumentBegin = () => ({
    type: CREATE_STUDENT_DOCUMENT.BEGIN,
});

export const createStudentDocumentSuccess = documents => ({
    type: CREATE_STUDENT_DOCUMENT.SUCCESS,
    payload: { documents },
});

export const createStudentDocumentFailure = reason => ({
    type: CREATE_STUDENT_DOCUMENT.FAILURE,
    payload: { reason },
});




export const deleteStudentDocument = documentId => ({
    type: DELETE_STUDENT_DOCUMENT.BASE,
    payload: { documentId },
});

export const deleteStudentDocumentBegin = () => ({
    type: DELETE_STUDENT_DOCUMENT.BEGIN,
});

export const deleteStudentDocumentSuccess = documents => ({
    type: DELETE_STUDENT_DOCUMENT.SUCCESS,
    payload: { documents },
});

export const deleteStudentDocumentFailure = reason => ({
    type: DELETE_STUDENT_DOCUMENT.FAILURE,
    payload: { reason },
});



export const updateStudentDocument = updateInfo => ({
    type: UPDATE_STUDENT_DOCUMENT.BASE,
    payload: { updateInfo },
});

export const updateStudentDocumentBegin = () => ({
    type: UPDATE_STUDENT_DOCUMENT.BEGIN,
});

export const updateStudentDocumentSuccess = documents => ({
    type: UPDATE_STUDENT_DOCUMENT.SUCCESS,
    payload: { documents },
});

export const updateStudentDocumentFailure = reason => ({
    type: UPDATE_STUDENT_DOCUMENT.FAILURE,
    payload: { reason },
});

export const getStudentDocumentTypes = () => ({
    type: GET_STUDENT_DOCUMENT_TYPES.BASE,
});

export const getStudentDocumentTypesSuccess = docTypes => ({
    type: GET_STUDENT_DOCUMENT_TYPES.SUCCESS,
    payload: { docTypes },
});

export const getStudentDocumentTypesFailure = () => ({
    type: GET_STUDENT_DOCUMENT_TYPES.FAILURE,
});