"use strict";


//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$( document ).ready( () => {
     $('#loginEmail').focus().select();
});


//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$('#formLogin').submit( (e) => {
     e.preventDefault();
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

               loadApplicationPage(data);
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Error Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`ERROR: ${errorThrown}`);
     });
}


//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
function loadApplicationPage({ token }){
     if(!token){
          return console.error('ERROR: Authentication Token was not provided.');
     }
     localStorage.setItem("bearerToken", token);

     $.ajax({
          url: `/inventory`,
          type: 'GET',
          dataType: 'html',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Load app page request - status: ${textStatus}`);
               //console.log('Response: ', data);
               //console.log('jqXHR object: ', jqXHR);
               
               $('body').empty();
               $('body').html(data);
               loadInventoryTable();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`ERROR: ${errorThrown}`);
     });
}