"use strict";

//----------------------------------------------------------------------------------------
// This function is triggered when the Inventory Modal is shown.
// It just triggers the event handler of clicking the "Info" Nav Pill located in this modal header.
//----------------------------------------------------------------------------------------
$('#inventoryModal').on('shown.bs.modal', () => {
     $('#modalPillInfo').trigger('click');
});


//----------------------------------------------------------------------------------------
// Whenever the "Info" Nav Pill (in the Inventory Modal header) is clicked,
// it will select the respective pill by adding the 'active' class to the <a> tag.
// After this, it clears all the visible content from the modal body and hides/shows the footer buttons.
// Then, it gets the item Id from the hidden <span> (#modalItemId) in modal body.
// Finally, it retrieves from the server an object with all information related to the selected item.
//----------------------------------------------------------------------------------------
$('#modalPillInfo').click( () => {
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillInfo .nav-link').addClass('active');
     clearModalBody();
     hideAndShowModalButtons('.modal-btn-close');
     let id = $('#modalItemId').text();
     fetchStockItemInfo(id);
});


//----------------------------------------------------------------------------------------
// Clears all the visible content from the Modal Body, except the spinner
// and the <span> tag containing the selected item id.
//----------------------------------------------------------------------------------------
function clearModalBody(){
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody).children().not('.my-modal-spinner, #modalItemId').remove();
     $('.my-modal-spinner').show();
}


//----------------------------------------------------------------------------------------
// This function hides al the buttons locaed in the modal (#inventoryModal) footer.
// And it shows the button(s) passed as argument. 
// The argument needs to be a string with a CSS selector for the button(s) to be shown    .
//----------------------------------------------------------------------------------------
function hideAndShowModalButtons(buttonToBeShown){
     if(! typeof toBeShown === 'string') 
          return console.error('ERROR: argument of function showHideModalButtons() needs to be of type String.');
     $("#inventoryModal .modal-footer button").hide();
     $(buttonToBeShown).show();
}


//----------------------------------------------------------------------------------------
// Makes and HTTP requisition (GET method) and retrieves data related to a specific stock item, 
// passing the parameter id of the item throught the URL.
//----------------------------------------------------------------------------------------
function fetchStockItemInfo(id){
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
               console.log(`Retrieve stock item information - GET request status: ${textStatus}`);
               $('.my-modal-spinner').hide();
               const { stockItem } = data;
               console.log(data);
               if(stockItem === null)
                    showModalErrorMsg();
               else
                    modalFillItemInformation(stockItem);
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`Error: ${errorThrown}`);
     });
}


//----------------------------------------------------------------------------------------
// This function gets all the data related to a specific item as parameter,
// Then, it fills the Modal Body with this information using jQuery.
//----------------------------------------------------------------------------------------
function modalFillItemInformation(stockItem){
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
     $(modalBody).append(`<p><span class='modal-item-info'>Status: </span>${availability}</p>`);
     
     $(modalBody).append(`<p><span class='modal-item-info'>Location: </span>${stockItem.location}</p>`);

     $(modalBody).append(`<p class="mb-0"><span class='modal-item-info'>Specifications:</span></p>`);
     $(modalBody).append(`<ul class='modal-list-specs pl-4'></ul>`);
     var specs = stockItem.itemModelId.specs;
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('.modal-list-specs').append(`<li><span class='modal-item-info'>${specStr}: </span>${specs[spec]}</li>`);
     }

     $(modalBody).append(`<h5 class='modal-item-section'>Management Information</h5>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Contract Number: </span>${stockItem.itemModelId.contractNumber}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Process Number: </span>${stockItem.itemModelId.processNumber}</p>`);
     $(modalBody).append("<p><span class='modal-item-info'>Warranty Expiration Date:</span> " + makeDateString(stockItem.itemModelId.warrantyExpirationDate) + "</p>");

     $(modalBody).append(`<h5 class='modal-item-section'>Transferred From</h5>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Department: </span>${stockItem.transferredFrom.department}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>User Name: </span>${stockItem.transferredFrom.userName}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>User Number: </span>${stockItem.transferredFrom.userNumber}</p>`);
     $(modalBody).append(`<p><span class='modal-item-info'>Task Numer: </span>${stockItem.transferredFrom.taskNumber}</p>`);
     $(modalBody).append("<p><span class='modal-item-info'>Date: </span>" + makeDateTimeString(stockItem.transferredFrom.date) + "</p>");

     $(modalBody).append(`<h5 class='modal-item-section'>Transferred To</h5>`);
     if( stockItem.transferredTo == undefined ){
          $(modalBody).append(`<p>This device was not transferred yet.</p>`);
     } else {
          let fullName = stockItem.transferredTo.transferredBy.firstName + ' ' + stockItem.transferredTo.transferredBy.lastName;
          let userPermission = '(' + stockItem.transferredTo.transferredBy.permission + ')' 
          $(modalBody).append(`<p><span class='modal-item-info'>User Name: </span>${stockItem.transferredTo.userName}</p>`);
          $(modalBody).append(`<p><span class='modal-item-info'>User Number: </span>${stockItem.transferredTo.userNumber}</p>`);
          $(modalBody).append(`<p><span class='modal-item-info'>Task Numer: </span>${stockItem.transferredTo.taskNumber}</p>`);
          $(modalBody).append(`<p><span class='modal-item-info'>Transferred By: </span>${fullName} <span class="text-red">${userPermission}</span></p>`);
          $(modalBody).append("<p><span class='modal-item-info'>Date: </span>" + makeDateTimeString(stockItem.transferredTo.date) + "</p>");
     }

     $(modalBody).append(`<h5 class='modal-item-section'>System Information</h5>`);
     $(modalBody).append("<p><span class='modal-item-info'>Created At: </span>" + makeDateTimeString(stockItem.createdAt) + "</p>");
     $(modalBody).append("<p><span class='modal-item-info'>Updated At: </span>" + makeDateTimeString(stockItem.updatedAt) + "</p>");
}


//----------------------------------------------------------------------------------------
// This function receives a String as a parameter with the format: "2020-12-26T18:40:47.834+00:00"
// Then, returns a String with the format: "Monday, December 9, 2024."
//----------------------------------------------------------------------------------------
function makeDateString(timestamp){
     const date = new Date(timestamp);
     const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
     const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
     return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '.';
}


//----------------------------------------------------------------------------------------
// This function receives a String as a parameter with the format: "2020-12-26T18:40:47.834+00:00"
// Then, returns a String with the format: "Saturday, December 26, 2020. 15:40 PM"
//----------------------------------------------------------------------------------------
function makeDateTimeString(timestamp){
     const date = new Date(timestamp);
     let hours = date.getHours();
     let mins = date.getMinutes();

     if(hours.toString().length == 1) hours = '0' + hours;
     if(mins.toString().length == 1) mins = '0' + mins;

     let timeStr = hours + ':' + mins;
     if( date.getHours() > 12) timeStr += ' PM';
     else timeStr += ' AM';
     return makeDateString(timestamp) + ' ' + timeStr;
}


//----------------------------------------------------------------------------------------
// Show an error message in the Modal Body in case of null data as response from the server.
//----------------------------------------------------------------------------------------
function showModalErrorMsg(){
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody).append(`<p id='modalErrorMsg'><strong>ERROR:</strong> Could not retrieve data for this specific item. Please, contact the System Admin.</p>`);
}