"use strict";

//----------------------------------------------------------------------------------------
// This function is triggered when the Inventory Modal is shown.
// It gets the item Id from the hidden cell in the table,
// Then it retrieves from the server all the data related to this specific item 
// With the fields "model" and the "category" populated.
//----------------------------------------------------------------------------------------
$('#inventoryModal').on('shown.bs.modal', () => {
     let id = $('#modalItemId').text();
     if( !id ) return console.error('Cannot find the id of the selected stock item.');

     $.ajax({
          url: `/inventory/items/${id}`,
          type: 'GET',
          contentType: 'application/json',
          //headers: {
          //     'Authorization': `Bearer ${accessToken}`
          //},
          //beforeSend: (xhr, settings) => {
          //     xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
          //},
          data: {}
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Retrieve item data - request status: ${textStatus}`);
               console.log(data);
               $('.my-modal-spinner').hide();
               modalFillItemInformation(data);
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`Error: ${errorThrown}`);
     });


});


//----------------------------------------------------------------------------------------
// This function gets all the data related to a specific item as parameter,
// Then, it fills the Modal Body with this information using jQuery.
//----------------------------------------------------------------------------------------
function modalFillItemInformation({ stockItem }){
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody).append(`<h4 class='modal-item-title'>${stockItem.category} - ${stockItem.itemModelId.brand} ${stockItem.itemModelId.name}</h4>`);
     $(modalBody).append(`<h5 class='modal-item-section mt-4'>General Information</h5>`);

     let inventoryNumberStr = stockItem.inventoryNumber.slice(0,3) + ' ' + stockItem.inventoryNumber.slice(3,6) + '.' + stockItem.inventoryNumber.slice(6);
     $(modalBody).append(`<p><span class='modal-item-info'>Inventory Number:</span> ${inventoryNumberStr}</p>`);
     
     let availability = stockItem.status.charAt(0).toUpperCase() + stockItem.status.slice(1);
     if(stockItem.status === 'available')
          availability += ' 👍';
     else if(stockItem.status === 'taken')
          availability += ' ❌';
     $(modalBody).append(`<p><span class='modal-item-info'>Status:</span> ${availability}</p>`);
     
     $(modalBody).append(`<p><span class='modal-item-info'>Location:</span> ${stockItem.location}</p>`);

     $(modalBody).append(`<p class="mb-0"><span class='modal-item-info'>Specifications:</span></p>`);
     $(modalBody).append(`<ul class='modal-list-specs pl-4'></ul>`);
     var specs = stockItem.itemModelId.specs;
     for(spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('.modal-list-specs').append(`<li><span class='modal-item-info'>${specStr}:</span> ${specs[spec]}</li>`);
     }

     $(modalBody).append(`<h5 class='modal-item-section'>Management Information</h5>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Contract Number:</span> ${stockItem.itemModelId.contractNumber}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Process Number:</span> ${stockItem.itemModelId.processNumber}</p>`);
     $(modalBody).append("<p><span class='modal-item-info'>Warranty Expiration Date:</span> " + makeDateString(stockItem.itemModelId.warrantyExpirationDate) + "</p>");

     $(modalBody).append(`<h5 class='modal-item-section'>Transferred From</h5>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Department:</span> ${stockItem.transferredFrom.department}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>User Name:</span> ${stockItem.transferredFrom.userName}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>User Number:</span> ${stockItem.transferredFrom.userNumber}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Task Numer:</span> ${stockItem.transferredFrom.taskNumber}</p>`);
     $(modalBody).append("<p><span class='modal-item-info'>Date:</span> " + makeTimeDateString(stockItem.transferredFrom.date) + "</p>");
     console.log( stockItem.transferredFrom.date );

     $(modalBody).append(`<h5 class='modal-item-section'>Transferred To</h5>`);
     if( stockItem.transferredTo == undefined ){
          $(modalBody).append(`<p>This device was not transferred yet.</p>`);
     } else {
          $(modalBody).append(`<p><span class='modal-item-info'>User Name:</span> ${stockItem.transferredTo.userName}</p>`);
          $(modalBody).append(`<p><span class='modal-item-info'>User Number:</span> ${stockItem.transferredTo.userNumber}</p>`);
          $(modalBody).append(`<p><span class='modal-item-info'>Task Numer:</span> ${stockItem.transferredTo.taskNumber}</p>`);
          $(modalBody).append("<p><span class='modal-item-info'>Date:</span> " + makeTimeDateString(stockItem.transferredTo.date) + "</p>");
     }

     $(modalBody).append(`<h5 class='modal-item-section'>System Information</h5>`);
     $(modalBody).append("<p><span class='modal-item-info'>Created At:</span> " + makeTimeDateString(stockItem.createdAt) + "</p>");
     $(modalBody).append("<p><span class='modal-item-info'>Updated At:</span> " + makeTimeDateString(stockItem.updatedAt) + "</p>");
}


//----------------------------------------------------------------------------------------
// This function returns a String with the format: "Monday, December 9, 2024."
//----------------------------------------------------------------------------------------
function makeDateString(timestamp){
     const date = new Date(timestamp);
     const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
     const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
     return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '.';
}


//----------------------------------------------------------------------------------------
// This function returns a String with the format: "Saturday, December 26, 2020. 15:40 PM"
//----------------------------------------------------------------------------------------
function makeTimeDateString(timestamp){
     const date = new Date(timestamp);
     let timeStr = date.getHours() + ':' + date.getMinutes();
     if( date.getHours() > 12) timeStr += ' PM';
     else timeStr += ' AM';
     return makeDateString(timestamp) + ' ' + timeStr;
}