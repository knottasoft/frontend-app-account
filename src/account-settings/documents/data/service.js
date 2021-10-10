import api from './api';

export async function getStudentDocuments(studentId) {
    console.log('getStudentDocuments => ' + studentId);

    const { data } = await api
        .get(`/docs?sid=${studentId}`);
    return data;
}

export async function createStudentDocument(doc) {
    console.log('createStudentDocument', doc);

    const formData = new FormData();
    formData.append('name', doc.name)
    formData.append('description', doc.description)
    formData.append('student_id', doc.student_id)

    const { data } = await api
        .post(`/docs/`, formData)
    
    for(var x = 0; x<doc.files.length; x++) {
            await createStudentDocumentFile(data.id, doc.files[x]);
    }

    return data;
}

export async function updateStudentDocument(updateInfo) {
    console.log('updateStudentDocument', updateInfo);

    const formData = new FormData();
    formData.append('name', updateInfo.title)
    formData.append('description', updateInfo.type)
    formData.append('student_id', updateInfo.student_id)

    const { data } = await api
        .put(`/docs/${updateInfo.id}/`, formData)
    
    for(var x = 0; x<updateInfo.files.length; x++) {
            await createStudentDocumentFile(data.id, updateInfo.files[x]);
    }

    for(var x = 0; x<updateInfo.filesIdToDelete.length; x++) {
        await deleteStudentDocumentFile(updateInfo.filesIdToDelete[x]);
    }
    
    return data
}

export async function deleteStudentDocument(docId) {
    console.log('deleteStudentDocument', docId);
    
    const { data } = await api
        .delete(`/docs/${docId}/`);

    return data;
}

export async function getStudentDocumentTypes() {
    const { data } = await api
        .get(`/docTypes/`)
    return data;
}

async function deleteStudentDocumentFile(fileId) {
    console.log('deleteStudentDocumentFile', fileId);
    
    const { data } = await api
        .delete(`/files/${fileId}/`);

    return data;
}

async function createStudentDocumentFile(documentId, file) {
    const formData = new FormData();
    formData.append('document', documentId)
    formData.append('file', file)

    const { data } = await api
        .post(`/files/`, formData)

    return data;
}