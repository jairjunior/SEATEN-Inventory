"use strict";

//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$('#navbarNav a.nav-link').click( event => {
     event.preventDefault();
     if( ! $(event.target.parentNode).hasClass('active') ){
          $('#navbarNav .nav-item.active span').remove();
          $('#navbarNav .nav-item.active').removeClass('active');

          $(event.target.parentNode).addClass('active');
          $(event.target).append(` <span class="sr-only">(current)</span>`);

          const pageToLoad = $(event.target).text().split(' ')[0].toLowerCase();
          console.log(`Page to load: ${pageToLoad}`);

          if(pageToLoad === 'register')
               loadRegisterPage();
          else if(pageToLoad === 'inventory')
               loadInventoryPage();
     }
});


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
               $(`link[href*="inventory.css"]`).remove();
               $('html head').append(`<link rel="stylesheet" href="../css/register.css">`);
               $('body main.container').empty().html(data);
               $('#navbarNav').collapse("toggle");
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`ERROR: ${errorThrown}`);
     });
}