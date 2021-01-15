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
function makeTablePagination(numOfItems){
    const numberOfPages = Math.ceil( numOfItems / $('#itemsPerPage').val() );
    if(numberOfPages < 1) throw "ERROR: Number of table pages cannot be less than 1.";

    $('#paginationContainer').attr('hidden', false);


    if( numberOfPages == 1 ){
         initializeTablePagination({ 'previous': 'disabled', 'next': 'disabled' });
    }
    else if( numberOfPages > 1 && numberOfPages <= 5 ){
         initializeTablePagination({ 'previous': 'disabled', 'next': 'enabled' });

         for(let i = 2; i <= numberOfPages; i++){
              let paginationNumberHTML = createPaginationNumber(i);
              $('#tablePaginationNext').before(paginationNumberHTML);
         }
    }
    else if( numberOfPages > 5 ){
         initializeTablePagination({ 'previous': 'disabled', 'next': 'enabled' });

         for(let i = 2; i <= 5; i++){
              let paginationNumberHTML;
              if ( i == 2 || i == 3 ){ paginationNumberHTML = createPaginationNumber(i); }
              else if( i == 4 ){ paginationNumberHTML = createPaginationNumber('...'); }
              else if( i == 5 ){ paginationNumberHTML = createPaginationNumber(numberOfPages); }
              $('#tablePaginationNext').before(paginationNumberHTML);
         }
    }

    setEventHandlersForPagination();
}


//----------------------------------------------------------------------------------------
// 
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
    
    // there will be always a page number 1
    $('#tablePagination ul.pagination .page-number').not('#pageNumberOne').remove();
    $('#pageNumberOne').addClass('active').attr({ 'aria-current': 'page' });
}


function createPaginationNumber(innerText){
    return    `<li class="page-item page-number ${ (innerText === '...') ? 'disabled' : '' }">
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

    
    $('#tablePagination .page-number').click( event => {
        if( ! $(event.target.parentNode).hasClass('active') ){
            $('#tablePagination .page-number.active').removeClass('active');
            $(event.target.parentNode).addClass('active');

            const pageNumber = $(event.target).text().trim().split(' ')[0];
            console.log('Página selecionada: ', pageNumber);

            const itemsPerPage = $('#itemsPerPage').val();
            console.log('Items por página: ', itemsPerPage);

            const {stockItems, itemModels} = getItemsFromLocalStorage();

            let firstIndex = itemsPerPage * (pageNumber - 1);
            let lastIndex = firstIndex + itemsPerPage;
            let itemsToShow = stockItems.slice(firstIndex, lastIndex);
            console.log('Items to show: ', itemsToShow);

            $('#inventoryTable tbody').empty();
            fillTableStockItems(itemsToShow, itemModels);
        }
    });


    $('#tablePaginationPrevious a.page-link').click( event => {
        
        if( $(event.target.parentNode).hasClass('disabled') ){
            console.log('Estou desabilitado.');
        }
        else{
            console.log('<< Página anterior');
        }
        
        console.log( $('#tablePagination .page-number.active').text() );
    });


    $('#tablePaginationNext a.page-link').click( event => {
        
        if( $(event.target.parentNode).hasClass('disabled') ){
            console.log('Estou desabilitado.');
        }
        else{
            console.log('Página seguinte >>');
        }
        
        console.log( $('#tablePagination .page-number.active').text() );
    });
}