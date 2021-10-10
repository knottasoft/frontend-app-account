import { 
    GET_STUDENT_DOCUMENTS, 
    GET_STUDENT_DOCUMENT_TYPES,
    CREATE_STUDENT_DOCUMENT,
    UPDATE_STUDENT_DOCUMENT,
    DELETE_STUDENT_DOCUMENT,
    STUDENT_DOCUMENT_CARD_ADD,
    STUDENT_DOCUMENT_CARD_CLOSE,
    STUDENT_DOCUMENT_CARD_EDIT,
} from "./actions";

export const defaultState = {
    status: null,
    errorType: null,
    documents: [],
    card: null,
    docTypes:[],
}

const reducer = (state = defaultState, action = null) => {
    if (action !== null)
    {
        switch (action.type) {
            case GET_STUDENT_DOCUMENTS.BEGIN:
                return {
                    ...state,
                    status: 'pending'
                };
            
            case GET_STUDENT_DOCUMENTS.SUCCESS:
                return {
                    ...state,
                    status: 'loaded',
                    documents: action.payload.documents,
                };

            case GET_STUDENT_DOCUMENTS.FAILURE:
                return {
                    ...state,
                    status: 'failed',
                    errorType: action.payload.reason || 'server',
                };
            
            case GET_STUDENT_DOCUMENTS.RESET: 
                const oldStatus = state.status;

                return {
                    ...state,
                    status: null,
                    errorType: null,
                };
            
            case CREATE_STUDENT_DOCUMENT.SUCCESS:
                return {
                    ...state,
                    card: null,
                    documents: action.payload.documents,
                }
                
            case UPDATE_STUDENT_DOCUMENT.SUCCESS:
                return {
                    ...state,
                    card: null,
                    documents: action.payload.documents,
                };

            case DELETE_STUDENT_DOCUMENT.SUCCESS:
                return {
                    ...state,
                    card: null,
                    documents: action.payload.documents,
                };


            case STUDENT_DOCUMENT_CARD_ADD:
                return {
                    ...state,
                    card: {
                        isNew: true,
                        type: "",
                        title: "",
                        files: []
                    }
                };
            
            case STUDENT_DOCUMENT_CARD_CLOSE:
                return {
                    ...state,
                    card: null
                }
                    
            case STUDENT_DOCUMENT_CARD_EDIT:
                return {
                    ...state,
                    card: {
                        isNew: false,
                        type: action.payload.document.description,
                        title: action.payload.document.name,
                        files: action.payload.document.files,
                        id: action.payload.document.id,
                    }
                }
            
            case GET_STUDENT_DOCUMENT_TYPES.SUCCESS:
                return {
                    ...state,
                    docTypes: action.payload.docTypes
                }
            default:
        }
    }
    console.log(state);
    return state;
};

export default reducer;