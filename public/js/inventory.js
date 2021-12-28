"use strict";


//----------------------------------------------------------------------------------------
// First of all, it builds the table header filling the columns names with the content in the array tHeaders.
// A hidden <th> is created at the end of the header to keep the ID of each stock item.
// The column containing the Item Ids is hidden from the view. JavaScript will handle it.
// Finally, it makes an AJAX requisition to retrieve all stock items from the database.
//----------------------------------------------------------------------------------------
export function loadInventoryTable(){
     const tHeaders = ['Stock Item', 'Inventory Number', 'Status', 'Location'];
     for (let i = 0; i < tHeaders.length; i++){
          $('#inventoryTable thead').append("<th scope='col'>"+ tHeaders[i] +"</th>");
     }
     $('#inventoryTable thead').append("<th scope='col' hidden>ID</th>");
     $('#paginationContainer').attr('hidden', true);
     $('#tableFilterInputField').attr('disabled', true);
     
     fetchStockItemsList();
     setClickableTableRows();
     setTableFilter();
}

//----------------------------------------------------------------------------------------
// Retrieves all stock items from the database.
// On success, it fills the table (#inventoryTable) with the items returned from the server
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
               console.log('%cFetch Stock Items List request status: ', 'color: green', `${textStatus}`);
               console.log(data);

               const { stockItems, itemModels } = data;
               localStorage.setItem( 'stockItems' , JSON.stringify(stockItems) );
               localStorage.setItem( 'itemModels' , JSON.stringify(itemModels) );
               
               $('.table-spinner').hide();
               if(stockItems < 1){
                    $('.table-spinner').hide();
                    $('#pNothingFound').show();
               }
               else{
                    fillTableStockItems(stockItems, itemModels);
                    $('#tableFilterInputField').attr('disabled', false);
               }
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
function fillTableStockItems(listOfItems, listOfModels, pageNumber){
     const itemsPerPage = ( listOfItems.length < $('#itemsPerPage').val() ) ? listOfItems.length : $('#itemsPerPage').val();
     
     if(pageNumber === undefined) pageNumber = 1;
     
     let firstIndex = parseInt( itemsPerPage ) * (pageNumber - 1);
     let lastIndex = firstIndex + parseInt( itemsPerPage );

     const itemsToShow = listOfItems.slice(firstIndex, (lastIndex > listOfItems.length) ? undefined : lastIndex);
     if(itemsToShow.length > itemsPerPage) return console.error('ERROR: In function fillTableStockItems(). Array itemsToShow is bigger than itemsPerPage.');

     $('#showingNumberOfItems p').text(`Showing ${firstIndex+1}-${(lastIndex > listOfItems.length) ? listOfItems.length : lastIndex} of ${listOfItems.length} items`)


     /*console.log('pageNumber: ', pageNumber);
     console.log('itemsPerPage: ', itemsPerPage);
     console.log('itemsToShow.length: ', itemsToShow.length);
     console.log('firstIndex: ', firstIndex);
     console.log('lastIndex: ', lastIndex);
     console.log('itemsToShow: ', itemsToShow);*/


     for(let i = 0; i < itemsToShow.length; i++){
          var stockItem = itemsToShow[i];

          let model = listOfModels.find( (model) => { return model._id === stockItem.itemModelId });
          if( !model ) return console.error(`ERROR: Could not find a respective model for the item (${stockItem.category}: ${stockItem.inventoryNumber}).`);

          let trTableStockItems = document.createElement('TR');
          
          let tdStockItem = document.createElement('TD');
          tdStockItem.textContent = `${stockItem.category} - ${model.brand} ${model.name}`;
          
          let tdInventoryNumber = document.createElement('TD');
          let inventoryNumberPrefix = stockItem.inventoryNumber.slice(0,3);
          let inventoryNumberStr = stockItem.inventoryNumber.slice(3,6) + '.' + stockItem.inventoryNumber.slice(6);
          tdInventoryNumber.innerHTML = `<span class='inventoryNumberPrefix'>${inventoryNumberPrefix}</span> ${inventoryNumberStr}`;
          
          let tdStatus = document.createElement('TD');
          let statusBadge = document.createElement('SPAN');
          if(stockItem.status === 'available'){
               statusBadge.classList.add('badge', 'badge-available');
               statusBadge.textContent = '👍';
               statusBadge.innerHTML += "<span class='itemStatusText'> AVAILABLE</span>";
          }
          else if(stockItem.status === 'taken'){
               statusBadge.classList.add('badge', 'badge-taken');
               statusBadge.textContent = '❌';
               statusBadge.innerHTML += "<span class='itemStatusText'> TAKEN</span>";
          }
          else if(stockItem.status === 'fixing'){
               statusBadge.classList.add('badge', 'badge-fixing');
               statusBadge.textContent = '🔧';
               statusBadge.innerHTML += "<span class='itemStatusText'> FIXING</span>";
          }
          else if(stockItem.status === 'donation'){
               statusBadge.classList.add('badge', 'badge-donation');
               statusBadge.textContent = '🎁';
               statusBadge.innerHTML += "<span class='itemStatusText'> DONATION</span>";
          }
          tdStatus.append(statusBadge);

          let tdLocation = document.createElement('TD');
          tdLocation.textContent = stockItem.location;

          let tdId = document.createElement('TD');
          tdId.setAttribute('hidden', true);
          tdId.textContent = stockItem._id;

          trTableStockItems.append(tdStockItem, tdInventoryNumber, tdStatus, tdLocation, tdId);
          $('#inventoryTable tbody').append(trTableStockItems);
     }
     
     makeTablePagination(listOfItems.length, pageNumber);
}


//----------------------------------------------------------------------------------------
// This function add the Event Listener to each row of the Inventory Table (#inventoryTable).
// When a row is clicked, the hidden id (last <td> of each table row) is saved into a variable
// and then it is saved into Local Storage for later use. Then, the modal body is cleared, 
// the buttons are hidden/shown and it's finally triggered to show up.
//----------------------------------------------------------------------------------------
function setClickableTableRows(){
     $('#inventoryTable').off();

     $('#inventoryTable').click( event => {
          let clickedRow = $(event.target).closest('tr');
          
          if(clickedRow.length === 1){
               let idSelectedItem = $(clickedRow).find('td:last').text();
               localStorage.setItem( "idSelectedItem", idSelectedItem );
               console.log('Id: ', idSelectedItem);

               clearModalBody();

               $("#inventoryModal .modal-footer button").hide();
               $('#modalBtnClose').show();

               $('#inventoryModal').modal('show');
          }
     });
}


//----------------------------------------------------------------------------------------
// This function sets the event handler for the filter field above the Inventory Table.
// To be valid, the filter text must have at least 3 characters and it can be letters and
// number.
// It will filter all the Stock Items using the function filterStockItems(), searching through
// Category, Inventory Number, Location, Current User, Requisition Number and Brand/Model.
//----------------------------------------------------------------------------------------
function setTableFilter(){
     $('#tableFilterInputField').on('input', (event) => {
          const {stockItems, itemModels} = getItemsFromLocalStorage();
          let filterText = $(event.target).val().trim();

          if( filterText.length >= 3 ){
               $('#inventoryTable tbody').empty();
               $('#pNothingFound').hide();
               $('.table-spinner').show();               
               
               const foundItems = filterStockItems(stockItems, itemModels, filterText);
               if(foundItems.length > 0){
                    //console.log('Items found: ' + foundItems.length);
                    $('.table-spinner').hide();
                    fillTableStockItems(foundItems, itemModels);
               }
               else{
                    $('.table-spinner').hide();
                    $('#paginationContainer').prop('hidden', true);
                    $('#pNothingFound').show();
               }
          }
          else {
               $('#pNothingFound').hide();
               $('.table-spinner').hide();
               $('#inventoryTable tbody').empty();
               fillTableStockItems(stockItems, itemModels);
          }
     });
}

function filterStockItems(stockItems, itemModels, filterText){
     var foundItems = new Array();
     const filterPattern = new RegExp(filterText, 'i');
     foundItems = foundItems.concat( filterByCategory(stockItems, filterPattern) );
     foundItems = foundItems.concat( filterByInventoryNumber(stockItems, filterPattern) );
     foundItems = foundItems.concat( filterByLocation(stockItems, filterPattern) );
     foundItems = foundItems.concat( filterByUser(stockItems, filterPattern) );
     foundItems = foundItems.concat( filterByReqNumber(stockItems, filterPattern) );
     foundItems = foundItems.concat( filterByModel(stockItems, itemModels, filterPattern) );
     return foundItems;
}

function filterByCategory(stockItems, filterPattern){
     return stockItems.filter( item => { return filterPattern.test( item.category ) });
}

function filterByInventoryNumber(stockItems, filterPattern){
     return stockItems.filter( item => { return filterPattern.test( item.inventoryNumber ) });
}

function filterByLocation(stockItems, filterPattern){
     return stockItems.filter( item => { return filterPattern.test( item.location ) });
}

function filterByUser(stockItems, filterPattern){
     return stockItems.filter( item => { 
          let lastTransfer = getLastTransferLog(item);
          if(item.status === 'donation') return false;
          else return filterPattern.test( lastTransfer.toUserName );
     });
}

function filterByReqNumber(stockItems, filterPattern){
     return stockItems.filter( item => { 
          let lastTransfer = getLastTransferLog(item);
          return filterPattern.test( lastTransfer.reqNumber );
     });
}

function filterByModel(stockItems, itemModels, filterPattern){
     var models = itemModels.filter( model => {
          if( filterPattern.test( model.brand ) || filterPattern.test( model.name ) )
               return true;
          else 
               return false;
     });

     var foundItems = new Array();
     models.forEach( model => {
          let modelPattern = new RegExp(model._id);
          let items = stockItems.filter( item => { return modelPattern.test( item.itemModelId ) });
          foundItems = foundItems.concat(items);
     });
     return foundItems;
}


//----------------------------------------------------------------------------------------
// Clears all the content of the main table
//----------------------------------------------------------------------------------------
function clearTableContent(){
     $('#inventoryTable thead').empty();
     $('#inventoryTable tbody').empty();
     $('#inventoryTable tfoot').empty();
     $('.table-spinner').show();
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function getItemsFromLocalStorage(){
     const stockItems = JSON.parse( localStorage.getItem('stockItems') );
     const itemModels = JSON.parse( localStorage.getItem('itemModels') );
     return {stockItems, itemModels}
}