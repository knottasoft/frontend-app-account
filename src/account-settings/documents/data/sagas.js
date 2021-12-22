import { put, call, takeEvery } from 'redux-saga/effects';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import {
    GET_STUDENT_DOCUMENTS,
    getStudentDocumentsBegin,
    getStudentDocumentsSuccess,
    getStudentDocumentsFailure,

    CREATE_STUDENT_DOCUMENT,
    createStudentDocumentBegin,
    createStudentDocumentSuccess,
    createStudentDocumentFailure,

    UPDATE_STUDENT_DOCUMENT,
    updateStudentDocumentBegin,
    updateStudentDocumentSuccess,
    updateStudentDocumentFailure,

    DELETE_STUDENT_DOCUMENT,
    deleteStudentDocumentBegin,
    deleteStudentDocumentSuccess,
    deleteStudentDocumentFailure,

    GET_STUDENT_DOCUMENT_TYPES,
    getStudentDocumentTypesSuccess,
    getStudentDocumentTypesFailure,

} from './actions';

import { 
    getStudentDocuments, 
    createStudentDocument,
    updateStudentDocument,
    deleteStudentDocument,
    getStudentDocumentTypes,
} from './service';

export function* handleGetStudentDocuments() {
    try {
        yield put(getStudentDocumentsBegin());
        const { userId } = getAuthenticatedUser();
        const response = yield call(getStudentDocuments, userId);
        yield put(getStudentDocumentsSuccess(response));
    } catch (e) {
        console.log(e);
        yield put(getStudentDocumentsFailure());
    }
}

export function* handleCreateStudentDocument(action) {
    try{
        yield put(createStudentDocumentBegin());
        const { userId, email } = getAuthenticatedUser();
        const data = {
            ...action.payload.document,
            student_id: userId,
            email: email,
        }
        yield call(createStudentDocument, data);
        const response = yield call(getStudentDocuments, userId);
        yield put(createStudentDocumentSuccess(response));
    } catch (e) {
        console.log(e);
        yield put(createStudentDocumentFailure(e));
    }
}

export function* handleUpdateStudentDocument(action) {
    try{
        yield put(updateStudentDocumentBegin());
        const { userId, email } = getAuthenticatedUser();
        const data = {
            ...action.payload.updateInfo,
            student_id: userId,
            email: email,
        }
        yield call(updateStudentDocument, data);
        const response = yield call(getStudentDocuments, userId);
        yield put(updateStudentDocumentSuccess(response));
    } catch (e) {
        console.log(e);
        yield put(updateStudentDocumentFailure(e));
    }
}

export function* handleDeleteStudentDocument(action) {
    try{
        yield put(deleteStudentDocumentBegin());
        yield call(deleteStudentDocument, action.payload.documentId);
        const { userId } = getAuthenticatedUser();
        const response = yield call(getStudentDocuments, userId);
        yield put(deleteStudentDocumentSuccess(response));
    } catch (e) {
        console.log(e);
        yield put(deleteStudentDocumentFailure(e));
    }
}

export function* handleGetStudentDocumentTypes() {
    try{
        const response = yield call(getStudentDocumentTypes);
        yield put(getStudentDocumentTypesSuccess(response));
    } catch (e) {
        console.log(e);
        yield put(getStudentDocumentTypesFailure(e));
    }
}

export default function* saga() {
    yield takeEvery(GET_STUDENT_DOCUMENTS.BASE, handleGetStudentDocuments)
    yield takeEvery(CREATE_STUDENT_DOCUMENT.BASE, handleCreateStudentDocument)
    yield takeEvery(UPDATE_STUDENT_DOCUMENT.BASE, handleUpdateStudentDocument)
    yield takeEvery(DELETE_STUDENT_DOCUMENT.BASE, handleDeleteStudentDocument)
    yield takeEvery(GET_STUDENT_DOCUMENT_TYPES.BASE, handleGetStudentDocumentTypes)
}