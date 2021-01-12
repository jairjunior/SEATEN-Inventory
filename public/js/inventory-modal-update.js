"use strict";

//----------------------------------------------------------------------------------------
// Whenever the "Transfer" Nav Pill (from the modal) is clicked,
// it will select the respective pill by adding the 'active' class to the <a> tag.
//----------------------------------------------------------------------------------------
$('#modalPillUpdate').click( event => {
     event.preventDefault();
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillUpdate .nav-link').addClass('active');
     clearModalBody();
     hideAndShowModalButtons('#modalBtnCancel, #modalBtnUpdate');
})