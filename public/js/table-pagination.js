"use strict";


//----------------------------------------------------------------------------------------
// 
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
// 
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
    else if( numberOfPages > 7 && (pageNumber > 5 || pageNumber < numberOfPages-3) ){
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
// Set the buttons "Previous" and "Next" according to the options variable.
// Remove any other pagination number except the number 1.
//----------------------------------------------------------------------------------------
function initializeTablePagination(options){
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
// 
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
        
        console.log('<< Página anterior');
        
        console.log( $('#tablePagination .page-number.active').text() );
    });


    $('#tablePaginationNext').click( event => {
        
        console.log('Página seguinte >>');
        
        console.log( $('#tablePagination .page-number.active').text() );
    });
}