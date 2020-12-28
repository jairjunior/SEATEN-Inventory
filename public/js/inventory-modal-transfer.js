"use strict";

//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$('#modalPillTransfer').click( () => {
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillTransfer .nav-link').addClass('active');
     clearModalBody();
})