"use strict";

//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$('#modalPillUpdate').click( () => {
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillUpdate .nav-link').addClass('active');
     clearModalBody();
})