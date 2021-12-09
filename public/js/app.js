"use strict";
import { loadInventoryTable } from './inventory.js';
import { fetchCategoryList, fetchModelList } from './register.js';


//----------------------------------------------------------------------------------------
// This function creates an event listener for the top navbar links (INVENTORY, REGISTER, DOCUMENTATION AND ACCOUNT)
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
               $(event.target).append(` <span class="sr-only">(current)</span>`);

               const pageToLoad = $(event.target).text().split(' ')[0].toLowerCase();
               console.log(`Page to load: ${pageToLoad}`);

               if(pageToLoad === 'inventory')
                    loadInventoryPage();
               else if(pageToLoad === 'register')
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
               console.log(`Load Inventory page request - status: ${textStatus}`);
               document.title = 'ICOS | SEATEN Inventory';
               window.history.pushState({}, 'ICOS | SEATEN Inventory', '/app/inventory');

               $(`head link`).not(`[href*="reset.css"], [href*="bootstrap.min.css"], [href*="app.css"]`).remove();
               $('html head').append(`<link rel="stylesheet" href="../css/inventory.css">`);

               $('body').children().not(`header, footer, script[src*="app.js"]`).remove();
               $('body header').after(data);
               $(`script[src*="app.js"]`).after(`
                    <script type="module" src="../js/inventory.js"></script>
                    <script type="text/javascript" src="../js/table-pagination.js"></script>
                    <script type="text/javascript" src="../js/inventory-modal-info.js"></script>
                    <script type="text/javascript" src="../js/inventory-modal-transfer.js"></script>
                    <script type="text/javascript" src="../js/inventory-modal-update.js"></script>
               `);

               $('#navbarNav').collapse('hide');
               localStorage.removeItem('itemCategories');
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
//
//----------------------------------------------------------------------------------------
function loadRegisterPage(){
     const token = localStorage.getItem('bearerToken');
 
     $.ajax({
          url: `/app/register`,
          type: 'GET',
          dataType: 'html',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Load Register page request - status: ${textStatus}`);
               document.title = 'ICOS | Register';
               window.history.pushState({}, 'ICOS | Register', '/app/register');

               $(`head link`).not(`[href*="reset.css"], [href*="bootstrap.min.css"], [href*="app.css"]`).remove();
               $('html head').append(`<link rel="stylesheet" href="../css/register.css">`);
               
               $('body').children().not(`header, footer, script[src*="app.js"]`).remove();
               $('body header').after(data);
               $(`script[src*="app.js"]`).after(`
                    <script type='module' src="../js/register.js"></script>
               `);
               $('#navbarNav').collapse('toggle');

               localStorage.removeItem('stockItems');
               fetchCategoryList();
               fetchModelList();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`ERROR: ${errorThrown}`);
     });
 }