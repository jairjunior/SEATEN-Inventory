"use strict";

//----------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------
$('#modalPillTransfer').click( () => {
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillTransfer .nav-link').addClass('active');
     clearModalBody();
     $('.modal-btn-cancel, .modal-btn-save').show();
     $('.modal-btn-close').hide();
     $('.my-modal-spinner').hide();
     buildTransferForm();
})



function buildTransferForm(){
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody)
     .append(  `<h4 class="modal-item-title mb-4">Transfer Item</h4>
               <form class="form-transfer-to mt-3">

                    <fieldset class="form-group">
                         <legend>User Info</legend>
                         <div class="form-row">
                              <div class="form-group col-md-9">
                                   <label for="transferUserName">Full Name</label>
                                   <input type="text" class="form-control" id="transferUserName" name="fullUserName">
                              </div>
                              <div class="form-group col-md-3">
                                   <label for="transferUserNumber">User Number</label>
                                   <input type="tel" class="form-control" id="transferUserNumber" name="userNumber">
                              </div>
                         </div>
                         <div class="form-row">
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Division</label>
                                   <input type="text" class="form-control" id="transferDepartment" name="department" placeholder="STI">
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Branch</label>
                                   <input type="text" class="form-control" id="transferDepartment" name="department" placeholder="SUTEC">
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Department</label>
                                   <input type="text" class="form-control" id="transferDepartment" name="department" placeholder="SEATEN">
                              </div>
                         </div>
                    </fieldset>

                    <fieldset class="form-group">
                         <legend>Requisition Info</legend>
                              <div class="form-row">
                                   <div class="form-group col-md-3">
                                        <label for="transferReqType">Type</label>
                                        <select id="transferReqType" class="form-control" name="reqType">
                                             <option selected>RITM</option>
                                             <option>INC</option>
                                        </select>
                                   </div>
                                   <div class="form-group col-md-9">
                                        <label for="transferReqNumber">Number</label>
                                        <input type="tel" class="form-control" id="transferReqNumber" name="reqNumber" placeholder="00017645">
                                   </div>
                              </div>
                    </fieldset>

               </form>`);
}