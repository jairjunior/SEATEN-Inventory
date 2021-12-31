"use strict";
import { httpRequests } from './HTTPRequests.js';
import { loadInventoryTable } from './inventory.js';
import { RegisterPage } from './Register.js';
import { RegisterNewItemForm } from './Form-RegisterNewItem.js';
import Alert from './Alert.js';

//----------------------------------------------------------------------------------------
// Detects when user tries to reload the application page. Asks for confirmation.
//----------------------------------------------------------------------------------------
$(window).on('beforeunload', (event) => {
     event.preventDefault();
     return confirm('Are you sure you want to reload the application?');
});

//----------------------------------------------------------------------------------------
// Detects when the user press the F5 key in order to reload the page.
//----------------------------------------------------------------------------------------
$(window).on('keydown', (event) => {
     if(event.code === 'F5'){
          event.preventDefault();
          reloadPage();
     }
});

//----------------------------------------------------------------------------------------
// Detects in which page of the application the user is in very moment,
// then reloads the content of the respective page.
//----------------------------------------------------------------------------------------
const reloadPage = () => {
     let currentPage = window.location.pathname.split('/').pop();
     if( currentPage === 'inventory' )
          loadInventoryPage();
     else if( currentPage === 'register' )
          loadRegisterPage();
     else if( currentPage === '' ){
          console.log('window.location.pathname: ' + window.location.pathname);
     }
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
$(window).on('popstate', (event) => {
     console.log(`%cHistory: ${window.history}`, 'color: blue; font weight: 700;');
     reloadPage();
});

//----------------------------------------------------------------------------------------
// This function creates an event listener for the top navbar links (INVENTORY, REGISTER, 
// DOCUMENTATION AND ACCOUNT)
// When one of them is clicked, it activates the link and calls the function to load the
// respective page.
//----------------------------------------------------------------------------------------
export function setEventListenerForNavbarLinks(){
     $('#navbarNav a.nav-link').click( event => {
          event.preventDefault();
          if( ! $(event.target.parentNode).hasClass('active') ){
               $('#navbarNav .nav-item.active span').remove();
               $('#navbarNav .nav-item.active').removeClass('active');

               $(event.target.parentNode).addClass('active');
               $(event.target).append(`<span class="sr-only">(current)</span>`);

               // next 2 lines for debugging
               const pageToLoad = $(event.target).text().split(' ')[0];
               console.log('%cPage to load: ', 'color: orange; font-weight: 600;', `${pageToLoad}`);

               if(pageToLoad === 'Inventory')
                    loadInventoryPage();
               else if(pageToLoad === 'Register')
                    loadRegisterPage();
          }
     });
}

//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
export function loadInventoryPage(){
     const token = localStorage.getItem('bearerToken');

     if(!token){
          return console.error('ERROR: Authentication Token was not found.');
     }

     $.ajax({
          url: '/app/inventory',
          type: 'GET',
          dataType: 'html',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log('%cFetch Inventory HTML Page request status: ', 'color: green', `${textStatus}`);
               document.title = 'ICOS | Inventory';
               window.history.pushState({page: 1}, 'ICOS | Inventory', '/app/inventory');

               $(`head link`).not(`[href*="reset.css"], [href*="bootstrap.min.css"], [href*="app.css"]`).remove();
               $('html head').append(`<link rel="stylesheet" href="../css/inventory.css">`);

               $('body').children().not(`
                    header,
                    footer, 
                    script[src*="http-requests.js"],
                    script[src*="app.js"]
               `).remove();
               
               $('body header').after(data);
               
               $(`script[src*="app.js"]`).after(`
                    <script type="module" src="../js/inventory.js"></script>
                    <script type="text/javascript" src="../js/table-pagination.js"></script>
                    <script type="text/javascript" src="../js/inventory-modal-info.js"></script>
                    <script type="text/javascript" src="../js/inventory-modal-transfer.js"></script>
                    <script type="text/javascript" src="../js/inventory-modal-update.js"></script>
               `);

               $('#navbarNav').collapse('hide');
               sessionStorage.removeItem('listOfCategories');
               sessionStorage.removeItem('listOfModels');
               loadInventoryTable();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`ERROR: ${errorThrown}`);
     });
}

//----------------------------------------------------------------------------------------
// This function load the Register Page keeping the app structure untouched.
// It uses the httRequests module to fetch the HTML content, then it clears the <body>
// and injects in place the new HTML content.
// After that, it will use the RegisterPage module to fill in 
//----------------------------------------------------------------------------------------
const loadRegisterPage = async () => {
     try{
          const HTMLContent = await httpRequests.fetchRegisterHTMLPage().then( response => response.text() );
          clearHTMLBody();
          $('body header').after(HTMLContent);

     }
     catch(error){ console.error('Error in loadRegisterPage() function.\n', error); }
     
     RegisterPage.setRegisterPageTitle();
     RegisterPage.setRegisterUrlAddress();
     RegisterPage.setRegisterCSSFiles();
     
     localStorage.removeItem('stockItems'); // remover essa parte futuramente
     localStorage.removeItem('itemModels'); // remover essa parte futuramente

     $('#navbarNav').collapse('toggle');

     await fetchAndStoreCategories();
     await fetchAndStoreModels();

     const registerNewItemForm = new RegisterNewItemForm({ root: '#form-RegisterNewItem' });
     registerNewItemForm.render();
}

//----------------------------------------------------------------------------------------
// Clears the <body> content keeping the app structure: 
// It will maintain untouched the top navbar, footer and app.js script.
//----------------------------------------------------------------------------------------
const clearHTMLBody = () => {
     $('body').children().not(`
                     header,
                     footer,
                     script[src*="app.js"]`)
                 .remove();
 }


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
const fetchAndStoreCategories = async () => {
     try{
          const serverResponse = await httpRequests.fetchCategoryList();
          const responseJSON = await serverResponse.json();

          if( responseJSON.ok )
               sessionStorage.setItem('listOfCategories', JSON.stringify(responseJSON.categories) );
          else{
               console.error(responseJSON);
               throw new Error('Cannot fetch list of categories from server.');
          }
     }
     catch(error){
          console.error('ERROR in function fetchAndStoreCategories().\n', error);
     }
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
const fetchAndStoreModels = async () => {
     try{
          const serverResponse = await httpRequests.fetchModelList();
          const responseJSON = await serverResponse.json();

          if( responseJSON.ok )
               sessionStorage.setItem('listOfModels', JSON.stringify(responseJSON.itemModels) );
          else{
               console.error(responseJSON);
               throw new Error('Cannot fetch list of models from server.');
          }
     }
     catch(error){
          console.error('ERROR in function fetchAndStoreModels().\n', error);
     }
}
