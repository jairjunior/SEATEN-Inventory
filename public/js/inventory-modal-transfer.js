"use strict";

//----------------------------------------------------------------------------------------
// Whenever the "Transfer" Nav Pill (from the modal) is clicked,
// it will select the respective pill by adding the 'active' class to the <a> tag.
// Then, it clears all the visible content from the modal body and 
// hides/shows the footer buttons and spinner.
// Finally, it build the "Transfer Item" form inside the modal body.
//----------------------------------------------------------------------------------------
$('#modalPillTransfer').click( () => {
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillTransfer .nav-link').addClass('active');
     clearModalBody();
     hideAndShowModalButtons('.modal-btn-cancel, .modal-btn-transfer');
     $('.my-modal-spinner').hide();
     buildTransferForm();
})


//----------------------------------------------------------------------------------------
// This function builds the "Transfer Item" form inside the modal (#inventoryModal) body.
// It also creates a hidden <fieldset> containing the id of the item to be transferred.
// NOTE: this action will just be allowed to some kinds of user permissions. 
// The server will asses the user permission by means of a middleware. The user permission 
// is already embedded in the Beared Token sent alongside with the HTTP request.
//----------------------------------------------------------------------------------------
function buildTransferForm(){
     let id = $('#modalItemId').text();

     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody)
     .append(  `<h4 class="modal-item-title mb-4">Transfer Item</h4>
               <form class="form-transfer-to mt-3">

                    <fieldset class="form-group">
                         <legend>User Info</legend>
                         <div class="form-row">
                              <div class="form-group col-md-9">
                                   <label for="transferUserName">Full Name</label>
                                   <input type="text" class="form-control" id="transferUserName" name="fullUserName" required>
                              </div>
                              <div class="form-group col-md-3">
                                   <label for="transferUserNumber">User Number</label>
                                   <input type="tel" class="form-control" id="transferUserNumber" name="userNumber" required>
                              </div>
                         </div>
                         <div class="form-row">
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Division</label>
                                   <input type="text" class="form-control" id="transferDepartment" name="department" placeholder="STI" required>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Branch</label>
                                   <input type="text" class="form-control" id="transferDepartment" name="department" placeholder="SUTEC" required>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Department</label>
                                   <input type="text" class="form-control" id="transferDepartment" name="department" placeholder="SEATEN" required>
                              </div>
                         </div>
                    </fieldset>

                    <fieldset class="form-group">
                         <legend>Requisition Info</legend>
                              <div class="form-row">
                                   <div class="form-group col-md-3">
                                        <label for="transferReqType">Type</label>
                                        <select id="transferReqType" class="form-control" name="reqType" required>
                                             <option selected>RITM</option>
                                             <option>INC</option>
                                        </select>
                                   </div>
                                   <div class="form-group col-md-9">
                                        <label for="transferReqNumber">Number</label>
                                        <input type="tel" class="form-control" id="transferReqNumber" name="reqNumber" placeholder="00017645" required>
                                   </div>
                              </div>
                    </fieldset>

                    <fieldset class="form-group" hidden>
                              <legend>Selected Item ID (Hidden)</legend>
                              <input type="text" class="form-control" id="transferItemId" name="stockItemId" disabled>
                    </fieldset>

               </form>`);

               $('#transferItemId').val(id);
}