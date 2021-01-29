"use strict";

//----------------------------------------------------------------------------------------
// This function is triggered when the Inventory Modal is shown.
// It just triggers the event handler of clicking the "Info" Nav Pill located in this modal header.
//----------------------------------------------------------------------------------------
$('#inventoryModal').on('shown.bs.modal', () => {
     $('#modalPillInfo').trigger('click');
});


//----------------------------------------------------------------------------------------
// This function is triggered when the Inventory Modal is hidden. Just clears the Local Storage keys.
//----------------------------------------------------------------------------------------
$('#inventoryModal').on('hidden.bs.modal', () => {
     localStorage.removeItem("idSelectedItem");
     localStorage.removeItem("selectedItem");
});


//----------------------------------------------------------------------------------------
// Whenever the "Info" Nav Pill (in the Inventory Modal header) is clicked,
// it will select the respective pill by adding the 'active' class to the <a> tag.
// After this, it clears all the visible content from the modal body and hides/shows the footer buttons.
// Then, it gets the item Id from the Local Storage.
// Finally, it retrieves from the server an object with all information related to the selected item.
//----------------------------------------------------------------------------------------
$('#modalPillInfo').click( event => {
     event.preventDefault();
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillInfo .nav-link').addClass('active');
     clearModalBody();
     hideAndShowModalButtons('#modalBtnClose');
     let idSelectedItem = localStorage.getItem('idSelectedItem');
     fetchStockItemInfo(idSelectedItem);
});


//----------------------------------------------------------------------------------------
// Clears all the visible content from the Modal Body, except the spinner.
//----------------------------------------------------------------------------------------
function clearModalBody(){
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody).children().not('.my-modal-spinner').remove();
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
     const token = localStorage.getItem('bearerToken');
     
     $.ajax({
          url: `/inventory/items/${id}`,
          type: 'GET',
          dataType: 'json',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Retrieve stock item information - status: ${textStatus}`);
               console.log('Stock Item info:', data);
               const { stockItem } = data;
               localStorage.setItem( "selectedItem", JSON.stringify(stockItem) );
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
// Finally, it adds an event listener to each collapse link in order to toggle the arrow
// direction every time a section is clicked to show its content.
//----------------------------------------------------------------------------------------
function modalFillItemInformation(stockItem){
     $('.my-modal-spinner').hide();
     let modalBody = $('#inventoryModal div.modal-body');
     let inventoryNumberStr = stockItem.inventoryNumber.slice(0,3) + ' ' + stockItem.inventoryNumber.slice(3,6) + '.' + stockItem.inventoryNumber.slice(6);
     
     $(modalBody).append(`<h4 class='modal-item-title'>${stockItem.category} - ${stockItem.itemModelId.brand} ${stockItem.itemModelId.name} <small>(${inventoryNumberStr})</small></h4>`);
     

     var [ collapseControl, collapseCard ] = createCollapseInfo('General Information', 'modalGeneralInfo');
     $(collapseControl).find('i.fas').removeClass('fa-caret-down');
     $(collapseControl).find('i.fas').addClass('fa-caret-up');
     $(collapseCard).addClass('show');
     $(collapseCard).find('.card-body').append(`<p><span class='modal-item-info'>Inventory Number:</span> ${inventoryNumberStr}</p>`);
     
     let availability = stockItem.status.charAt(0).toUpperCase() + stockItem.status.slice(1);
     if(stockItem.status === 'available')
          availability += ' 👍';
     else if(stockItem.status === 'taken')
          availability += ' ❌';
     else if(stockItem.status === 'fixing')
          availability += ' 🔧';
     else if(stockItem.status === 'donation')
          availability += ' 🎁';

     $(collapseCard).find('.card-body').append(`<p><span class='modal-item-info'>Status: </span>${availability}</p>`);
     $(collapseCard).find('.card-body').append(`<p><span class='modal-item-info'>Location: </span>${stockItem.location}</p>`);
     $(collapseCard).find('.card-body').append(`<p class="mb-0"><span class='modal-item-info'>Specifications:</span></p>`);
     $(collapseCard).find('.card-body').append(`<ul class='pl-4' id='modalListOfItemSpecs'></ul>`);
     
     const specs = stockItem.itemModelId.specs;
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $(collapseCard).find('#modalListOfItemSpecs').append(`<li><span class='modal-item-info'>${specStr}: </span>${specs[spec]}</li>`);
     }
     $(modalBody).append(collapseControl);
     $(modalBody).append(collapseCard);



     [ collapseControl, collapseCard ] = createCollapseInfo('Management Information', 'modalManagementInfo');
     $(collapseCard).find('.card-body').append(`<p><span class='modal-item-info'>Contract Number: </span>${stockItem.itemModelId.contractNumber}</p>`);
     $(collapseCard).find('.card-body').append(`<p><span class='modal-item-info'>Process Number: </span>${stockItem.itemModelId.processNumber}</p>`);
     $(collapseCard).find('.card-body').append("<p><span class='modal-item-info'>Warranty Expiration Date:</span> " + makeDateString(stockItem.itemModelId.warrantyExpirationDate) + "</p>");
     $(modalBody).append(collapseControl);
     $(modalBody).append(collapseCard);



     [ collapseControl, collapseCard ] = createCollapseInfo('Transfer History', 'modalTransferHistory');
     for(let i = 0; i < stockItem.transferHistory.length; i++){
          let transferLog = stockItem.transferHistory[i];
          let newTransferInfo = $(`<div class='transfer-log'></div>`);

          $(newTransferInfo).append(`<h6 class='text-red transfer-log-title'><bold>Log ${i+1}<bold></h6>`);
          $(newTransferInfo).append(`<p><span class='modal-item-info'>Requisition Number: </span>${transferLog.reqNumber}</p>`);
          $(newTransferInfo).append(`<p><span class='modal-item-info'>Reason: </span>${transferLog.reason}</p>`);
          if(transferLog.oldItem)
               $(newTransferInfo).append(`<p><span class='modal-item-info'>Old Item: </span>${transferLog.oldItem}</p>`);
          if(transferLog.remarks)
               $(newTransferInfo).append(`<p><span class='modal-item-info'>Remarks: </span>${transferLog.remarks}</p>`);
          
          $(newTransferInfo).append(`<p class="mb-0"><span class='modal-item-info'>FROM:</span></p>`);
          $(newTransferInfo).append(`
               <ul class='pl-4'>
                    <li><span class='modal-item-info'>User: </span>${transferLog.fromUserName}</li>
                    <li><span class='modal-item-info'>User Number: </span>${transferLog.fromUserNumber}</li>
                    <li><span class='modal-item-info'>Department: </span>${transferLog.fromDepartment}</li>
               </ul>
          `);
          
          $(newTransferInfo).append(`<p class="mb-0"><span class='modal-item-info'>TO:</span></p>`);
          $(newTransferInfo).append(`
               <ul class='pl-4'>
                    <li><span class='modal-item-info'>User: </span>${transferLog.toUserName}</li>
                    <li><span class='modal-item-info'>User Number: </span>${transferLog.toUserNumber}</li>
                    <li><span class='modal-item-info'>Department: </span>${transferLog.toDepartment}</li>
               </ul>
          `);
          
          let fullName = transferLog.transferredBy.firstName + ' ' + transferLog.transferredBy.lastName;
          let userPermission = '(' + transferLog.transferredBy.permission + ')';
          $(newTransferInfo).append("<p><span class='modal-item-info'>Date: </span>" + makeDateTimeString(transferLog.date) + "</p>");
          $(newTransferInfo).append(`<p><span class='modal-item-info'>Transferred By: </span>${fullName} <span class="text-red">${userPermission}</span></p>`);

          if(i < stockItem.transferHistory.length - 1) 
               $(newTransferInfo).addClass('only-bottom-border pb-4 mb-4')
          
          $(collapseCard).find('.card-body').append(newTransferInfo);
          $(modalBody).append(collapseControl);
          $(modalBody).append(collapseCard);
     }



     [ collapseControl, collapseCard ] = createCollapseInfo('System Information', 'modalSystemInfo');
     $(collapseCard).find('.card-body').append("<p><span class='modal-item-info'>Created At: </span>" + makeDateTimeString(stockItem.createdAt) + "</p>");
     $(collapseCard).find('.card-body').append("<p><span class='modal-item-info'>Updated At: </span>" + makeDateTimeString(stockItem.updatedAt) + "</p>");
     $(modalBody).append(collapseControl);
     $(modalBody).append(collapseCard);



     $('.modal-collapse-info').click( (event) => {
          let element = $(event.currentTarget).find('i.fas');

          if( $(element).hasClass('fa-caret-down') ){
               $(element).removeClass('fa-caret-down');
               $(element).addClass('fa-caret-up');
          } else {
               $(element).removeClass('fa-caret-up');
               $(element).addClass('fa-caret-down');
          }
     });
}


function createCollapseInfo(title, bodyId){
     let collapseControl = $(`
          <a class="modal-collapse-info" data-toggle="collapse" href="#${bodyId}" role="button" aria-expanded="false" aria-controls="${bodyId}">
               <h5 class='modal-item-section d-flex justify-content-between'>
                    <span>${title}</span> <i class="fas fa-caret-down mr-2"></i>
               </h5>
          </a>
     `);
     
     let collapseCard = $(`
          <div class="collapse" id="${bodyId}">
               <div class="card card-body">
               </div>
          <div>
     `);

     return [ collapseControl, collapseCard ];
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