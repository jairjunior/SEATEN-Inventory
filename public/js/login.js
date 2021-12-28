"use strict";
import { setEventListenerForNavbarLinks, loadInventoryPage } from './app.js';

//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$( document ).ready( () => {
     $('#loginEmail').focus().select();
});


//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$('#formLogin').submit( (event) => {
     event.preventDefault();
     let formData = $('#formLogin').serializeArray();

     var objFormData = {};
     formData.forEach(currentElement => {
          var { name, value } = currentElement;
          objFormData[name] = value;
     });

     console.log('Login info: ', objFormData);
     submitToLogin(objFormData);
});


//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
function submitToLogin(userInfo){
     $.ajax({
          url: `/auth/authenticate`,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(userInfo),
          dataType: 'json'
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Login request - status: ${textStatus}`);
               console.log('Response: ', data);
               //console.log('jqXHR object: ', jqXHR);

               const { token } = data;
               localStorage.setItem("bearerToken", token);
               loadAppStructure();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Error Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR.responseText}`);
          console.error(`ERROR: ${errorThrown}`);
     });
}


//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
function loadAppStructure(){
     const token = localStorage.getItem('bearerToken');

     if(!token){
          return console.error('ERROR: Authentication Token was not found.');
     }

     $.ajax({
          url: '/app',
          type: 'GET',
          dataType: 'html',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Load App Structure page request - status: ${textStatus}`);
               $(`link[href*="login.css"]`).remove();
               $('html head').append(` <link rel="stylesheet" href="../css/app.css"> `);

               $('body').empty().html(data);
               setEventListenerForNavbarLinks();
               loadInventoryPage();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`ERROR: ${errorThrown}`);
     });

}