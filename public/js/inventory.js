"use strict";

//----------------------------------------------------------------------------------------
// This function will execute when the page is completely loaded.
// First of all, it builds the table header filling the columns names with the content in the array tHeaders.
// A hidden <th> is created at the end of the header to keep the ID of each stock item.
// The column containing the Item Ids is hidden from the view. JavaScript will handle it.
// Finally, it makes an AJAX requisition to retrieve all stock items from the database.
//----------------------------------------------------------------------------------------
$( document ).ready( () => {
     const tHeaders = ['Stock Item', 'Inventory Number', 'Status', 'Location'];
     for (let i = 0; i < tHeaders.length; i++){
          $('.table-stock-items thead').append("<th scope='col'>"+ tHeaders[i] +"</th>");
     }
     $('.table-stock-items thead').append("<th scope='col' hidden>ID</th>");
     fetchStockItemsList();
});

//----------------------------------------------------------------------------------------
// Retrieves all stock items from the database.
// On success, it fills the table (.table-stock-items) with the items returned from the server
// and finally it adds an event listener to detect clicks on any table row.
//----------------------------------------------------------------------------------------
function fetchStockItemsList(){
     $.ajax({
          url: '/inventory/items',
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
               console.log(`Retrieve complete list of stock items - GET request status: ${textStatus}`);
               console.log(data);
               $('.my-table-spinner').hide();
               fillTableStockItems(data);
               setClickableTableRows();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`Error: ${errorThrown}`);
     });
}


//----------------------------------------------------------------------------------------
// This function fills the inventory table with the data received from the server.
// It receives two parameters: one containing all the stock items found in the database
// and another with all the models registered.
//----------------------------------------------------------------------------------------
function fillTableStockItems({ stockItems, itemModels }){
     
     for(let index in stockItems){
          const stockItem = stockItems[index];

          const model = itemModels.find( (model) => { return model._id === stockItem.itemModelId })
          if( !model ) return console.error(`ERROR: Could not find a respective model for the item (${stockItem.category}: ${stockItem.inventoryNumber}).`);

          let trTableStockItems = document.createElement('TR');
          //trTableStockItems.classList.add('table-stock-row');
          
          let tdStockItem = document.createElement('TD');
          tdStockItem.textContent = `${stockItem.category} - ${model.brand} ${model.name}`;
          
          let tdInventoryNumber = document.createElement('TD');
          let inventoryNumberStr = stockItem.inventoryNumber.slice(0,3) + ' ' + stockItem.inventoryNumber.slice(3,6) + '.' + stockItem.inventoryNumber.slice(6);
          tdInventoryNumber.textContent = inventoryNumberStr;
          
          let tdStatus = document.createElement('TD');
          let statusBadge = document.createElement('SPAN');
          if(stockItem.status === 'available'){
               statusBadge.classList.add('badge', 'badge-available');
               statusBadge.textContent = '👍 AVAILABLE';
          }
          else if(stockItem.status === 'taken'){
               statusBadge.classList.add('badge', 'badge-taken');
               statusBadge.textContent = '❌ TAKEN';
          }
          tdStatus.append(statusBadge);

          let tdLocation = document.createElement('TD');
          tdLocation.textContent = stockItem.location;

          let tdId = document.createElement('TD');
          tdId.setAttribute('hidden', true);
          tdId.textContent = stockItem._id;

          trTableStockItems.append(tdStockItem, tdInventoryNumber, tdStatus, tdLocation, tdId);
          $('.table-stock-items tbody').append(trTableStockItems);
     }
}


//----------------------------------------------------------------------------------------
// This function add the Even Listener to each row of the Invenotory Table (.table-stock-items).
// When a row is clicked, the hidden id (last <td> of each table row) is saved into a variable.
// Then, this id is appended to a hidden <span> tag located in the modal body.
// Finally, the modal is triggered to show up.
//----------------------------------------------------------------------------------------
function setClickableTableRows(){
     $('.table-stock-items').click( (event) => {
          let clickedRow = $(event.target).closest('tr');
          
          if(clickedRow.length === 1){
               let id = $(clickedRow).find('td:last').text();
               console.log('Id of selected item: ', id);

               let modalBody = $('#inventoryModal div.modal-body');
               $(modalBody).children().not('.my-modal-spinner').remove();
               $(modalBody).append("<span id='modalItemId' hidden>"+ id +"</span>");

               $("#inventoryModal .modal-footer button").hide();
               $('.modal-btn-close').show();

               $('#inventoryModal').modal('show');
          }
     });
}