"use strict";

var items;

$( document ).ready( () => {
     const listStockItemsURL = '/inventory/items';     
     const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGU0NTM5ZjA5OTA3NDYxNDNlYTk2OCIsImlhdCI6MTYwODg0MTE3MCwiZXhwIjoxNjA4OTI3NTcwfQ.DC0G3Su4u9vOEBZ6Qjuorpn0W5abtUHEQmR_PxmAP90';

     $.ajax({
          url: listStockItemsURL,
          type: 'GET',
          beforeSend: (xhr) => {
               xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
          },
          data: {}
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Retrieve stock items - Request status: ${textStatus}`);
               fillTableStockItems(data);
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
     });
     
});


function fillTableStockItems({ stockItems }){
     
     for(const item in stockItems){
          let stockItem = stockItems[item];

          if(stockItem.type !== stockItem.model.type)
               console.error(`In item (${stockItem.inventoryNumber}), models do not match. Please, Inform Admin to fix this discrepancy.`)
          else if (stockItem.status === 'Available' && stockItem.location.substring(0, 6) !== 'SEATEN')
               console.error(`Item (${stockItem.inventoryNumber}) is marked as Available, but its location is different from SEATEN. Please, inform System Admin to fix this discrepancy.`)

          let trTableStockItems = document.createElement('TR');
          let tdStockItem = document.createElement('TD');
          let tdInventoryNumber = document.createElement('TD');
          let tdStatus = document.createElement('TD');
          let statusBadge = document.createElement('SPAN');
          let tdLocation = document.createElement('TD');

          tdStockItem.textContent = `${stockItem.model.type} - ${stockItem.model.brand} ${stockItem.model.name}`;
          
          let inventoryNumber = stockItem.inventoryNumber.slice(0,3) + ' ' + stockItem.inventoryNumber.slice(3,6) + '.' + stockItem.inventoryNumber.slice(6);
          tdInventoryNumber.textContent = inventoryNumber;
          
          if(stockItem.status === 'Available'){
               statusBadge.classList.add('badge', 'badge-available');
               statusBadge.textContent = '👍 AVAILABLE';
          }
          else if(stockItem.status === 'Taken'){
               statusBadge.classList.add('badge', 'badge-taken');
               statusBadge.textContent = '❌ TAKEN';
          }
          tdStatus.append(statusBadge);

          tdLocation.textContent = stockItem.location;

          trTableStockItems.append(tdStockItem, tdInventoryNumber, tdStatus, tdLocation);
          $('.table-stock-items tbody').append(trTableStockItems);
     }
}