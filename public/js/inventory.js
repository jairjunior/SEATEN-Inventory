"use strict";

//----------------------------------------------------------------------------------------
// Detects when user tries to reload the application page. Asks for confirmation.
//----------------------------------------------------------------------------------------
$(window).on('beforeunload', (event) => {
     event.preventDefault();
     return confirm('Are you sure you want to reload the application?')
});


//----------------------------------------------------------------------------------------
// First of all, it builds the table header filling the columns names with the content in the array tHeaders.
// A hidden <th> is created at the end of the header to keep the ID of each stock item.
// The column containing the Item Ids is hidden from the view. JavaScript will handle it.
// Finally, it makes an AJAX requisition to retrieve all stock items from the database.
//----------------------------------------------------------------------------------------
function loadInventoryTable(){
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
               console.log(`Succeed to retrieve list of stock items - status: ${textStatus}`);
               console.log(data);

               const { stockItems, itemModels } = data;
               localStorage.setItem( 'stockItems' , JSON.stringify(stockItems) );
               localStorage.setItem( 'itemModels' , JSON.stringify(itemModels) );
               $('.table-spinner').hide();
               fillTableStockItems(stockItems, itemModels);
               $('#tableFilterInputField').attr('disabled', false);
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
function fillTableStockItems(stockItems, itemModels){

     const itemsPerPage = ( stockItems.length < $('#itemsPerPage').val() ) ? stockItems.length : $('#itemsPerPage').val();

     for(let i = 0; i < itemsPerPage; i++){
          const stockItem = stockItems[i];

          const model = itemModels.find( (model) => { return model._id === stockItem.itemModelId });
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
          tdStatus.append(statusBadge);

          let tdLocation = document.createElement('TD');
          tdLocation.textContent = stockItem.location;

          let tdId = document.createElement('TD');
          tdId.setAttribute('hidden', true);
          tdId.textContent = stockItem._id;

          trTableStockItems.append(tdStockItem, tdInventoryNumber, tdStatus, tdLocation, tdId);
          $('#inventoryTable tbody').append(trTableStockItems);
     }
     
     makeTablePagination(stockItems.length);
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function makeTablePagination(numItems){
     const numberOfPages = Math.ceil( numItems / $('#itemsPerPage').val() );
     if(numberOfPages < 1) throw "Number of table pages cannot be less than 1.";

     //console.log('Total of items: ', numItems);
     //console.log('Total of pages: ', numberOfPages);

     $('#paginationContainer').attr('hidden', false);
     $('#tablePagination').empty().html(`
          <nav aria-label="Inventory Table - Pagination">
               <ul class="pagination">
                    <li id="tablePaginationPrevious" class="page-item disabled">
                         <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                    </li>
                    
                    <li class="pagination-number page-item active" aria-current="page">
                         <a class="page-link" href="#">1 <span class="sr-only">(current)</span></a>
                    </li>
                    
                    <li id="tablePaginationNext" class="page-item disabled">
                         <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
                    </li>
               </ul>
          </nav>
     `);

     if( numberOfPages > 1 && numberOfPages <= 5 ){
          $('#tablePaginationNext').removeClass('disabled');
          $('#tablePaginationNext a.page-link').attr({ 'aria-disabled': false, 'tabindex': '0' });
          for(let i = 2; i <= numberOfPages; i++){
               let paginationNumberHTML = createPaginationNumber(i);
               $('#tablePaginationNext').before(paginationNumberHTML);
          }
     }
     else if( numberOfPages > 5 ){
          $('#tablePaginationNext').removeClass('disabled');
          $('#tablePaginationNext a.page-link').attr({ 'aria-disabled': false, 'tabindex': '0' });
          for(let i = 2; i <= 5; i++){
               let paginationNumberHTML;
               if ( i == 2 || i == 3 ){
                    paginationNumberHTML = createPaginationNumber(i);
               }
               else if( i == 4 ){
                    paginationNumberHTML = createPaginationNumber('...');
               }
               else if( i == 5 ){
                    paginationNumberHTML = createPaginationNumber(numberOfPages);
               }
               $('#tablePaginationNext').before(paginationNumberHTML);
          }
     }

     $('#tablePagination a.page-link').click( event => {
          event.preventDefault();
     });
}


function createPaginationNumber(innerText){
     return    `<li class="pagination-number page-item ${ (innerText === '...') ? 'disabled' : '' }">
                    <a class="page-link" href="#" ${ (innerText === '...') ? "tabindex='-1' aria-disabled='true'" : '' }>${innerText}</span></a>
               </li>`
}


$('#itemsPerPage').change( () => {
     if( $('#tableFilterInputField').val().trim().length >= 3 ){
          $('#tableFilterInputField').trigger( 'input' );
     }
     else{
          clearTableContent();
          loadInventoryTable();
     }
});

//----------------------------------------------------------------------------------------
// This function add the Event Listener to each row of the Inventory Table (#inventoryTable).
// When a row is clicked, the hidden id (last <td> of each table row) is saved into a variable
// and then it is saved into Local Storage for later use. Then, the modal body is cleared, 
// the buttons are hidden/shown and it's finally triggered to show up.
//----------------------------------------------------------------------------------------
function setClickableTableRows(){
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
//
//----------------------------------------------------------------------------------------
function setTableFilter(){
     $('#tableFilterInputField').on('input', (event) => {
          let filterText = $(event.target).val().trim();
          
          if( filterText.length >= 3 ){
               $('#inventoryTable tbody').empty();
               $('#pNothingFound').hide();
               $('.table-spinner').show();
               
               var foundItems = new Array();
               const {stockItems, itemModels} = getItemsFromLocalStorage();
               const filterPattern = new RegExp(filterText, 'i');
               foundItems = foundItems.concat( filterByCategory(stockItems, filterPattern) );
               foundItems = foundItems.concat( filterByInventoryNumber(stockItems, filterPattern) );
               foundItems = foundItems.concat( filterByLocation(stockItems, filterPattern) );
               foundItems = foundItems.concat( filterByUser(stockItems, filterPattern) );
               foundItems = foundItems.concat( filterByReqNumber(stockItems, filterPattern) );
               foundItems = foundItems.concat( filterByModel(stockItems, itemModels, filterPattern) );

               if(foundItems.length > 0){
                    console.log('Items found: ' + foundItems.length);
                    $('.table-spinner').hide();
                    fillTableStockItems(foundItems, itemModels);
               }
               else{
                    $('.table-spinner').hide();
                    $('#paginationContainer').attr('hidden', true);
                    $('#pNothingFound').show();
               }
          }
          else {
               const {stockItems, itemModels} = getItemsFromLocalStorage();
               $('#pNothingFound').hide();
               $('.table-spinner').hide();
               $('#inventoryTable tbody').empty();
               fillTableStockItems(stockItems, itemModels);
          }
     });
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
          if(item.transferredTo)
               return filterPattern.test( item.transferredTo.userName );
          else 
               return false;
     });
}

function filterByReqNumber(stockItems, filterPattern){
     return stockItems.filter( item => { 
          if(item.transferredTo)
               return filterPattern.test( item.transferredTo.taskNumber );
          else 
               return false;
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