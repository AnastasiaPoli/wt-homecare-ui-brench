
export const handleException = (dispatch, error, dispatchType, defaultErrorObject) => {
    if(error.response !== undefined ){
        dispatch({type: dispatchType, payload: {errorMessage : error.response.data} });
    }else {
        dispatch({type: dispatchType, payload: {errorMessage : defaultErrorObject} });
    }
}