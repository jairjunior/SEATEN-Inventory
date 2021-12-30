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
        if( serverResponse.ok && serverResponse.status === 200){
            console.log('%cFetch Register HTML Page request status: ', 'color: green', `${serverResponse.statusText}`);
            return serverResponse;
        }
        else 
            throw new Error( `HTTP error on function httpRequests.fetchRegisterHTMLPage(). Status: ${serverResponse.status}. Body: ${serverResponse.json()}` );
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
    .then( async (serverResponse) => {
        if( serverResponse.ok && serverResponse.status === 200){
            console.log('%cFetch Category List request status: ', 'color: green', `${serverResponse.statusText}`);
            return serverResponse;
        }
        else{
            const { status, statusText }  = serverResponse;
            const responseJSON = await serverResponse.json();
            throw new Error(`HTTP error in function httpRequests.fetchCategoryList().\nServer message: ${responseJSON.error}\nStatus ${status}: ${statusText}.`);
        }
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
    .then( async (serverResponse) => {
        if( serverResponse.ok && serverResponse.status === 200){
            console.log('%cFetch Model List request status: ', 'color: green', `${serverResponse.statusText}`);
            return serverResponse;
        }
        else{
            console.log(serverResponse);
            const { status, statusText }  = serverResponse;
            const responseJSON = await serverResponse.json();
            throw new Error(`HTTP error in function httpRequests.fetchModelList().\nServer message: ${responseJSON.error}\nStatus ${status}: ${statusText}`);
        }
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
    .then( async (serverResponse) => {
        if( serverResponse.ok && serverResponse.status === 200){
            console.log('%cRegister New Stock Item request status: ', 'color: green', `${serverResponse.statusText}`);
            return serverResponse;
        }
        else{
            console.log(serverResponse);
            const { status, statusText }  = serverResponse;
            const responseJSON = await serverResponse.json();
            throw new Error(`HTTP error in httpRequests.createNewStockItem().\n\tServer message: ${responseJSON.error}\n\tStatus ${status}: ${statusText}`);
        }
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
