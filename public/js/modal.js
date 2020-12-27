var item;
$('#inventoryModal').on('shown.bs.modal', () => {
     let id = $('#modalItemId').text();
     if( !id ) return console.error('Errouuuuu!!!');

     $.ajax({
          url: `/inventory/items/${id}`,
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
               console.log(`Retrieve item data - request status: ${textStatus}`);
               console.log(data);
               $('.my-inventory-modal-spinner').hide();
               modalShowItemInformation(data);
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR}`);
          console.error(`Error: ${errorThrown}`);
     });


});


function modalShowItemInformation({ stockItem }){
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody).append(`<h4 class='modal-item-title'>${stockItem.category} - ${stockItem.itemModelId.brand} ${stockItem.itemModelId.name}</h4>`);

     let inventoryNumberStr = stockItem.inventoryNumber.slice(0,3) + ' ' + stockItem.inventoryNumber.slice(3,6) + '.' + stockItem.inventoryNumber.slice(6);
     $(modalBody).append(`<p><span class='modal-item-info'>Inventory Number:</span> ${inventoryNumberStr}</p>`);
     
     let availability = stockItem.status.charAt(0).toUpperCase() + stockItem.status.slice(1);
     if(stockItem.status === 'available')
          availability += ' 👍';
     else if(stockItem.status === 'taken')
          availability += ' ❌';
     $(modalBody).append(`<p><span class='modal-item-info'>Availability:</span> ${availability}</p>`);
     
     $(modalBody).append(`<p><span class='modal-item-info'>Location:</span> ${stockItem.location}</p>`);

     $(modalBody).append(`<p class="mb-0"><span class='modal-item-info'>Specifications:</span></p>`);

     $(modalBody).append(`<ul class='modal-list-specs pl-3'></ul>`);
     console.log(stockItem.itemModelId.specs);
     var specs = stockItem.itemModelId.specs;
     for(spec in specs){
          console.log(spec + ': ' + specs[spec]);
          
          $('.modal-list-specs').append(`<li><span class='modal-item-spec'>${spec}:</span> ${specs[spec]}</li>`);
     }

}