"use strict";

//----------------------------------------------------------------------------------------
// Whenever the "Transfer" Nav Pill (from the modal) is clicked,
// it will select the respective pill by adding the 'active' class to the <a> tag.
//----------------------------------------------------------------------------------------
$('#modalPillUpdate').click( () => {
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillUpdate .nav-link').addClass('active');
     clearModalBody();
     hideAndShowModalButtons('.modal-btn-cancel, .modal-btn-update');
})