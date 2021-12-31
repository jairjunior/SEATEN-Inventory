"use strict";

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
const fetchRegisterHTMLPage = () => {
    const token = localStorage.getItem('bearerToken');
    const url = '/app/register';
    const requestHeaders = new Headers({
        'Authorization': `Bearer ${token}`
    });

    return fetch( url, {
        method: 'GET',
        credentials: 'include',
        headers: requestHeaders
    })
    .then( serverResponse => {
        const { status, statusText }  = serverResponse;
        console.log('%cFetch Register HTML Page request status: ', 'color: blue', `${status} - ${statusText}`);
        return serverResponse;
    })
    .catch( error => {
        console.error(error);
    });
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
const fetchCategoryList = () => {
    const token = localStorage.getItem('bearerToken');
    const url = '/inventory/categories';
    const requestHeaders = new Headers({
        'Authorization': `Bearer ${token}`
    });

    return fetch( url, {
        method: 'GET',
        credentials: 'include',
        headers: requestHeaders
    })
    .then( serverResponse => {
        const { status, statusText }  = serverResponse;
        console.log('%cFetch Category List request status: ', 'color: blue', `${status} - ${statusText}`);
        return serverResponse;
    })
    .catch( error => {
        console.error(error);
    });
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
const fetchModelList = () => {
    const token = localStorage.getItem('bearerToken');
    const url = '/inventory/models';
    const requestHeaders = new Headers({
        'Authorization': `Bearer ${token}`
    });

    return fetch( url, {
        method: 'GET',
        credentials: 'include',
        headers: requestHeaders
    })
    .then( serverResponse => {
        const { status, statusText }  = serverResponse;
        console.log('%cFetch Model List request status: ', 'color: blue', `${status} - ${statusText}`);
        return serverResponse;
    })
    .catch( error => {
        console.error(error);
    });
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
const createNewStockItem = (data) => {
    const token = localStorage.getItem('bearerToken');
    const url = '/inventory/items';
    const requestHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    return fetch( url, {
        method: 'POST',
        credentials: 'include',
        headers: requestHeaders,
        body: JSON.stringify(data)
    })
    .then( serverResponse => {
        const { status, statusText }  = serverResponse;
        console.log('%cRegister New Stock Item request status: ', 'color: blue', `${status} - ${statusText}`);
        return serverResponse;
    })
    .catch( error => {
        console.error(error);
    });
}

//----------------------------------------------------------------------------------------
// Exports the functions in this module
//----------------------------------------------------------------------------------------
export const httpRequests = {
    fetchRegisterHTMLPage,
    fetchCategoryList,
    fetchModelList,
    createNewStockItem
 };
