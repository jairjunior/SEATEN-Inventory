"use strict";

//----------------------------------------------------------------------------------------
// First of all, it builds the table header filling the columns names with the content in the array tHeaders.
// A hidden <th> is created at the end of the header to keep the ID of each stock item.
// The column containing the Item Ids is hidden from the view. JavaScript will handle it.
// Finally, it makes an AJAX requisition to retrieve all stock items from the database.
//----------------------------------------------------------------------------------------
function loadInventoryTable(){
     const tHeaders = ['Stock Item', 'Inventory Number', 'Status', 'Location'];
     for (let i = 0; i < tHeaders.length; i++){
          $('.table-inventory thead').append("<th scope='col'>"+ tHeaders[i] +"</th>");
     }
     $('.table-inventory thead').append("<th scope='col' hidden>ID</th>");
     fetchStockItemsList();
}

//----------------------------------------------------------------------------------------
// Retrieves all stock items from the database.
// On success, it fills the table (.table-inventory) with the items returned from the server
// and finally it adds an event listener to detect clicks on any table row.
//----------------------------------------------------------------------------------------
function fetchStockItemsList(){
     const token = localStorage.getItem('bearerToken');

     $.ajax({
          url: '/inventory/items',
          type: 'GET',
          dataType: 'json',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Succeed to retrieve list of stock items - status: ${textStatus}`);
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
     
     for(let item in stockItems){
          const stockItem = stockItems[item];

          const model = itemModels.find( (model) => { return model._id === stockItem.itemModelId });
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
          $('.table-inventory tbody').append(trTableStockItems);
     }
}


//----------------------------------------------------------------------------------------
// This function add the Event Listener to each row of the Inventory Table (.table-inventory).
// When a row is clicked, the hidden id (last <td> of each table row) is saved into a variable
// and then it is saved into Local Storage for later use. Then, the modal body is cleared, 
// the buttons are hidden/shown and it's finally triggered to show up.
//----------------------------------------------------------------------------------------
function setClickableTableRows(){
     $('.table-inventory').click( (event) => {
          let clickedRow = $(event.target).closest('tr');
          
          if(clickedRow.length === 1){
               let idSelectedItem = $(clickedRow).find('td:last').text();
               localStorage.setItem( "idSelectedItem", idSelectedItem );
               console.log('Id: ', idSelectedItem);

               clearModalBody();

               $("#inventoryModal .modal-footer button").hide();
               $('.modal-btn-close').show();

               $('#inventoryModal').modal('show');
          }
     });
}