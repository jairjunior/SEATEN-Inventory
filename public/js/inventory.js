"use strict";

var items;

$( document ).ready( () => {
     const listStockItemsURL = '/inventory/items';     
     const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGU0NTM5ZjA5OTA3NDYxNDNlYTk2OCIsImlhdCI6MTYwOTAwNTI3NSwiZXhwIjoxNjA5MDkxNjc1fQ.qU_AgTtJ-gKTDjSIGyunSGbQuwXAswLrRWcWotX-O0k';
     

     // First of all, build the table header with the columns names in the array below.
     const theaders = ['Stock Item', 'Inventory Number', 'Status', 'Location'];
     for (let i = 0; i < theaders.length; i++){
          $('.table-stock-items thead').append("<th scope='col'>"+ theaders[i] +"</th>");
     }


     $.ajax({
          url: listStockItemsURL,
          type: 'GET',
          contentType: 'application/json',
          headers: {
               'Authorization': `Bearer ${accessToken}`
          },
          //beforeSend: (xhr, settings) => {
          //     xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
          //},
          data: {}
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Retrieve stock items - request status: ${textStatus}`);
               console.log(data);
               $('.my-spinner').hide();
               fillTableStockItems(data);
               rowsClickable();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`Error: ${errorThrown}`);
     });
     
});



function fillTableStockItems({ stockItems, itemModels }){
     
     for(let index in stockItems){
          const stockItem = stockItems[index];

          const model = itemModels.find( (model) => { return model._id === stockItem.itemModelId })
          if( !model ) return console.error(`ERROR: Could not find a respective model for the item (${stockItem.category}: ${stockItem.inventoryNumber}).`);

          let trTableStockItems = document.createElement('TR');
          
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

          trTableStockItems.append(tdStockItem, tdInventoryNumber, tdStatus, tdLocation);
          $('.table-stock-items tbody').append(trTableStockItems);
     }
}



function rowsClickable(){
     $('.table-stock-items TR').click( () => {
          $('#inventoryModal').modal('show');
     });
}