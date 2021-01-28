"use strict";


//----------------------------------------------------------------------------------------
// Every time the user changes the number of items to be displayed in the Inventory Table
// this event is triggered and clears all the table content and then load it again.
// The pagination will be re-built by the function makeTablePagination(), which is called
// by the function fillTableStockItems() in the chain.
//----------------------------------------------------------------------------------------
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
// This function builds the Inventory Table pagination according to the total number of
// items to ble displayed and the value selected by the user in the #itemsPerPage <select> field.
//----------------------------------------------------------------------------------------
function makeTablePagination(numOfItems, pageNumber){

    pageNumber = parseInt(pageNumber);
    const numberOfPages = Math.ceil( numOfItems / $('#itemsPerPage').val() );
    if(numberOfPages < 1) return console.error("ERROR: Number of table pages cannot be less than 1.");

    
    if(pageNumber == 1)
        initializeTablePagination({ 'previous': 'disabled', 'next': 'enabled' });
    else if(pageNumber == numberOfPages)
        initializeTablePagination({ 'previous': 'enabled', 'next': 'disabled' });
    else 
        initializeTablePagination({ 'previous': 'enabled', 'next': 'enabled' });


    if( numberOfPages == 1 ){
         $('#pageNumberOne').addClass('active').attr({ 'aria-current': 'page' });
         $('#pageNumberOne a.page-link').append(` <span class="sr-only">(current)</span>`);
    }
    else if( numberOfPages >= 2 && numberOfPages <= 7 ){
         for(let i = 2; i <= numberOfPages; i++){
              let paginationNumberHTML = createPaginationNumber(i);
              $('#tablePaginationNext').before(paginationNumberHTML);
         }
    }
    else if( numberOfPages > 7 && pageNumber < 5){
        for(let i = 2; i <= 7; i++){
            let paginationNumberHTML;
            if ( i >= 2 && i <= 5 ) paginationNumberHTML = createPaginationNumber(i);
            else if( i == 6 ) paginationNumberHTML = createPaginationNumber('...');
            else if( i == 7 ) paginationNumberHTML = createPaginationNumber(numberOfPages);
            $('#tablePaginationNext').before(paginationNumberHTML);
        }
    }
    else if( numberOfPages > 7 && pageNumber >= numberOfPages-3 ){
        for(let i = 2; i <= 7; i++){
            let paginationNumberHTML;
            if ( i == 2 ) paginationNumberHTML = createPaginationNumber('...');
            else if( i >= 3 && i <= 7 ) paginationNumberHTML = createPaginationNumber( numberOfPages - (7-i) );
            $('#tablePaginationNext').before(paginationNumberHTML);
        }
    }
    else if( numberOfPages > 7 && (pageNumber >= 5 || pageNumber < numberOfPages-3) ){
        for(let i = 2; i <= 7; i++){
            let paginationNumberHTML;
            if ( i == 2 ) paginationNumberHTML = createPaginationNumber('...');
            else if( i == 3 ) paginationNumberHTML = createPaginationNumber(pageNumber-1);
            else if( i == 4 ) paginationNumberHTML = createPaginationNumber(pageNumber);
            else if( i == 5 ) paginationNumberHTML = createPaginationNumber(pageNumber+1);
            else if( i == 6 ) paginationNumberHTML = createPaginationNumber('...');
            else if( i == 7 ) paginationNumberHTML = createPaginationNumber(numberOfPages);
            $('#tablePaginationNext').before(paginationNumberHTML);
        }
    }

    setEventHandlersForPagination();

    const activePageNumber = $(`#tablePagination .page-number a:contains('${pageNumber}')`);
    $(activePageNumber).parent().addClass('active').attr({ 'aria-current': 'page' });
    $(activePageNumber).append(` <span class="sr-only">(current)</span>`);
    
    $('#paginationContainer').attr('hidden', false);
}


//----------------------------------------------------------------------------------------
// Set up the buttons "Previous" and "Next" according to the 'options' parameter.
// First, removes any event handler attached to the main buttons.
// Remove any other pagination number except the number 1.
//----------------------------------------------------------------------------------------
function initializeTablePagination(options){

    $('#tablePaginationPrevious').off();
    $('#pageNumberOne').off();
    $('#tablePaginationNext').off();

    if( options.previous === 'disabled' ){
         $('#tablePaginationPrevious').addClass('disabled');
         $('#tablePaginationPrevious a.page-link').attr({ 'tabindex': '-1', 'aria-disabled': true });
    } 
    else if( options.previous === 'enabled' ){
         $('#tablePaginationPrevious').removeClass('disabled');
         $('#tablePaginationPrevious a.page-link').attr({ 'tabindex': '0', 'aria-disabled': false });
    }
    
    if( options.next === 'disabled' ){
         $('#tablePaginationNext').addClass('disabled');
         $('#tablePaginationNext a.page-link').attr({ 'tabindex': '-1', 'aria-disabled': true });
    }
    else if( options.next === 'enabled' ){
         $('#tablePaginationNext').removeClass('disabled');
         $('#tablePaginationNext a.page-link').attr({ 'tabindex': '0', 'aria-disabled': false });
    }
    
    $('#tablePagination .page-number, #tablePagination .page-ellipsis').not('#pageNumberOne').remove();
    $('#pageNumberOne').removeClass('active').attr({ 'aria-current': false });
    $('#pageNumberOne a.page-link').find('span').remove();
}


function createPaginationNumber(innerText){
    return    `<li class="page-item ${ (innerText === '...') ? 'page-ellipsis disabled' : 'page-number' }">
                   <a class="page-link" href="#" ${ (innerText === '...') ? "tabindex='-1' aria-disabled='true'" : '' }>${innerText}</span></a>
              </li>`
}


//----------------------------------------------------------------------------------------
// This function adds event handlers to the pagination items. Whenever one is clicked,
// it will handle the event properly, changing the items appearing in the Inventory table.
//----------------------------------------------------------------------------------------
function setEventHandlersForPagination(){
    $('#tablePagination a.page-link').click( event => {
        event.preventDefault();
    });

    
    $('#tablePagination ul.pagination .page-number').click( event => {
        if( ! $(event.target.parentNode).hasClass('active') ){

            const pageNumber = $(event.target).text().trim().split(' ')[0];
            console.log('Selected page: ', pageNumber);

            $('#inventoryTable tbody').empty();
            
            const {stockItems, itemModels} = getItemsFromLocalStorage();

            if( $('#tableFilterInputField').val().trim().length >= 3 ){
                const filterText = $('#tableFilterInputField').val().trim();
                console.log('Texto no campo filtro: ', filterText);
                const foundItems = filterStockItems(stockItems, itemModels, filterText);
                console.log('items filtrados: ', foundItems);
                fillTableStockItems(foundItems, itemModels, pageNumber);
            }
            else{
                fillTableStockItems(stockItems, itemModels, pageNumber);
            }

        }
    });


    $('#tablePaginationPrevious').click( event => {
        if( $('#tablePaginationPrevious').hasClass('disabled') ) return;

        let pageNumber = $('#tablePagination .page-number.active').text().trim().split(' ')[0];
        pageNumber = parseInt(pageNumber) - 1;
        console.log('Previous page: ', pageNumber);
        changeTablePage(pageNumber);
    });


    $('#tablePaginationNext').click( event => {
        if( $('#tablePaginationNext').hasClass('disabled') ) return;

        let pageNumber = $('#tablePagination .page-number.active').text().trim().split(' ')[0];
        pageNumber = parseInt(pageNumber) + 1;
        console.log('Next page: ', pageNumber);
        changeTablePage(pageNumber);
    });
}


//----------------------------------------------------------------------------------------
// This function is responsible for change the page in the inventory table when one of the
// buttons 'Next' or 'Previous' is clicked.
// It clears the table content and then fill it again showing the corresponding items. 
// If there are any text in the Filter field, it will first filter the items and then show 
// the page with the found items.
//----------------------------------------------------------------------------------------
function changeTablePage(pageNumber){
    $('#inventoryTable tbody').empty();
        
    const {stockItems, itemModels} = getItemsFromLocalStorage();

    if( $('#tableFilterInputField').val().trim().length >= 3 ){
        const filterText = $('#tableFilterInputField').val().trim();
        const foundItems = filterStockItems(stockItems, itemModels, filterText);
        fillTableStockItems(foundItems, itemModels, pageNumber);
    }
    else{
        fillTableStockItems(stockItems, itemModels, pageNumber);
    }
}