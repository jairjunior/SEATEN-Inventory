"use strict";

//----------------------------------------------------------------------------------------
// Whenever the "Transfer" Nav Pill (from the modal) is clicked,
// it will select the respective pill by adding the 'active' class to the <a> tag.
// Then, it clears all the visible content from the modal body and 
// hides/shows the footer buttons and spinner.
// Finally, it build the "Transfer Item" form inside the modal body.
//----------------------------------------------------------------------------------------
$('#modalPillTransfer').click( event => {
     event.preventDefault();
     $('.inventory-modal-pills .nav-link').removeClass('active');
     $('#modalPillTransfer .nav-link').addClass('active');
     clearModalBody();
     $('.my-modal-spinner').hide();
     hideAndShowModalButtons('#modalBtnCancel, #modalBtnTransfer');
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
     const item = JSON.parse( localStorage.getItem('selectedItem') );
     let inventoryNumberStr = item.inventoryNumber.slice(0,3) + ' ' + item.inventoryNumber.slice(3,6) + '.' + item.inventoryNumber.slice(6);
     var transferHistory = item.transferHistory;
     transferHistory.sort( (logA, logB) => {
          return logA.date - logB.date;
     });
     const lastTransfer = transferHistory[transferHistory.length-1];
     const currentUser = lastTransfer.toUserName + ` (${lastTransfer.toUserNumber})`;

     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody)
     .append(  `<h4 class="modal-item-title mb-4">Transfer Item</h4>
               <form class="mt-3" id="formTransfer">

                    <fieldset class="form-group item-info">
                         <legend>Item Info</legend>
                         <div class="form-row">
                              <div class="form-group col-md-8">
                                   <label for="transferItemName">Name and Model</label>
                                   <input type="text" class="form-control" id="transferItemName" name="itemName" value="${item.category} - ${item.itemModelId.brand} ${item.itemModelId.name}" required disabled>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferInventoryNumber">Inventory Number</label>
                                   <input type="text" class="form-control" id="transferInventoryNumber" name="inventoryNumber" value="${inventoryNumberStr}" required disabled>
                              </div>
                         </div>
                         <div class="form-row">
                              <div class="form-group col-md-12">
                                   <label for="transferCurrentUser">Current User</label>
                                   <input type="text" class="form-control" id="transferCurrentUser" name="currentUser" value="${currentUser}" required disabled>
                              </div>
                         </div>
                    </fieldset>

                    <fieldset class="form-group">
                         <legend>Reason</legend>
                         <div class="form-row">
                              <div class="form-group col-md-12">
                                   <label for='transferReason'>Select:</label>
                                   <select class='form-control' name='reason' id='transferReason' aria-describedby="transferReasonFeedback" required>
                                        <option value='' selected disabled>---</option>
                                        <option value='New installation'>New installation</option>
                                        <option value='Replacement'>Replacement</option>
                                        <option value='Without use'>Without use</option>
                                        <option value='Department change'>Department change</option>
                                        <option value='Donation'>Donation</option>
                                        <option value='Repair / Warranty'>Repair / Warranty</option>
                                        <option value='Keep in stock'>Keep in stock</option>
                                   </select>
                                   <div id="transferReasonFeedback"></div>
                              </div>
                         </div>
                         <div class="form-row" id='transferOldItemRow' hidden>
                              <div class="form-group col-md-12">
                                   <label for="transferOldItem">Old Item</label>
                                   <input type="text" class="form-control" id="transferOldItem" aria-describedby="transferOldItemFeedback" name="oldItem" placeholder="inventory number">
                                   <div id="transferOldItemFeedback"></div>
                              </div>
                         </div>
                    </fieldset>

                    <fieldset class="form-group">
                         <legend>Destination</legend>
                         <div class="form-row">
                              <div class="form-group col-md-9">
                                   <label for="transferUserName">Full User Name</label>
                                   <input type="text" class="form-control" id="transferUserName" aria-describedby="transferUserNameFeedback" name="toUserName" required>
                                   <div id="transferUserNameFeedback"></div>
                              </div>
                              <div class="form-group col-md-3">
                                   <label for="transferUserNumber">User Number</label>
                                   <input type="tel" class="form-control" id="transferUserNumber" aria-describedby="transferUserNumberFeedback" name="toUserNumber" required>
                                   <div id="transferUserNumberFeedback"></div>
                              </div>
                         </div>
                         <div class="form-row">
                              <div class="form-group col-md-4">
                                   <label for="transferDivision">Division</label>
                                   <input type="text" class="form-control" id="transferDivision" aria-describedby="transferDivisionFeedback" name="division" placeholder="STI" required>
                                   <div id="transferDivisionFeedback"></div>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferBranch">Branch</label>
                                   <input type="text" class="form-control" id="transferBranch" aria-describedby="transferBranchFeedback" name="branch" placeholder="SUTEC" required>
                                   <div id="transferBranchFeedback"></div>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferDepartment">Department</label>
                                   <input type="text" class="form-control" id="transferDepartment" aria-describedby="transferDepartmentFeedback" name="department" placeholder="SEATEN" required>
                                   <div id="transferDepartmentFeedback"></div>
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
                                   <input type="tel" class="form-control" id="transferReqNumber" name="reqNumber" aria-describedby="transferReqNumberFeedback" placeholder="00017123" required>
                                   <div id="transferReqNumberFeedback"></div>
                              </div>
                         </div>
                    </fieldset>

                    <fieldset class="form-group">
                         <legend>Remarks</legend>
                         <div class="form-row">
                              <div class="form-group col-md-12">
                                   <textarea class="form-control" id="transferRemarks" name="remarks" rows='4' placeholder='Make any observation (optional)...' aria-describedby="remarksHelp"></textarea>
                              </div>
                         </div>
                    </fieldset>

               </form>`
     );


     $('#transferReason').change( () => {
          let fieldValue = $('#transferReason').val();
          if(fieldValue === 'Replacement'){
               $('#transferOldItemRow').prop('hidden', false);
               $('#transferOldItem').prop('required', true);
          }
          else{
               $('#transferOldItemRow').prop('hidden', true);
               $('#transferOldItem').prop('required', false);
          }
     });
}


//----------------------------------------------------------------------------------------
// When the button "Transfer" on the modal is clicked, it gets all the data from the form
// and adds the id of the selected item in the end of the array.
// Then, it converts the array to an object and shows the confirmation modal on the screen.
// It awaits for the user to confirm and finally calls the function to send it to the server
// as a PUT HTTP request
//----------------------------------------------------------------------------------------
$('#modalBtnTransfer').click( async () => {
     let idSelectedItem = localStorage.getItem('idSelectedItem');
     if( !idSelectedItem ) return console.error('ERROR: No Id found in Local Storage. Please, contact the System Admin to fix this bug.');
     
     if ( validateTransferForm() ){
          let formData = $('#formTransfer').serializeArray();
          formData.push({ name: 'stockItemId', value: idSelectedItem });

          var objFormData = {};
          formData.forEach( (currentElement) => {
               var { name, value } = currentElement;
               objFormData[name] = value;
          });

          const item = JSON.parse( localStorage.getItem('selectedItem') );
          const lastTransfer = item.transferHistory[item.transferHistory.length-1];
          objFormData.fromUserName = lastTransfer.toUserName;
          objFormData.fromUserNumber = lastTransfer.toUserNumber;
          objFormData.fromDepartment = lastTransfer.toDepartment;

          var statusStr = '';
          if( objFormData.department === 'SEATEN' && objFormData.reason !== 'Repair / Warranty' ) statusStr = 'available';
          else if(objFormData.department === 'SEATEN' && objFormData.reason === 'Repair / Warranty') statusStr = 'fixing';
          else if(objFormData.reason === 'Donation') statusStr = 'donation';
          else statusStr = 'taken';
          objFormData.status = statusStr;

          const division = objFormData.division.trim().toUpperCase();
          const branch = objFormData.branch.trim().toUpperCase();
          const department = objFormData.department.trim().toUpperCase();
          const locationStr =  `${division} | ${branch} | ${department}`;
          objFormData.toDepartment = locationStr;
          delete objFormData.division;
          delete objFormData.branch;
          delete objFormData.department;

          let reqNumber = objFormData.reqType + objFormData.reqNumber.trim();
          objFormData.reqNumber = reqNumber;
          delete objFormData.reqType;

          console.log('Transfer Form data:', objFormData);
          
          showModalTransferConfirmation(objFormData);
          try {
               await waitTransferConfirmation();
               console.log('O usuário confirmou a ação.');
               $('#opacityLayer').toggleClass('opacity-layer', false);
               $('#confirmationModal').modal('hide');
               submitFormTransfer(objFormData);
          }
          catch(error) {
               console.log('O usuário cancelou a ação.');
               $('#opacityLayer').toggleClass('opacity-layer', false);
               $('#inventoryModal').modal('hide');
          }
     }
     else{
          return console.error('ERROR: Form data is invalid. Please, review all the fields.');
     }
});


//----------------------------------------------------------------------------------------
// This function shows the Confirmation Modal on the screen.
// This function is called when the user click in the Transfer button to submit the Transfer Form.
//----------------------------------------------------------------------------------------
function showModalTransferConfirmation(objFormData) {
     $('#opacityLayer').toggleClass('opacity-layer', true);
     $('#confirmationModal').modal('show');
     $('#confirmationModal .modal-body').empty();
     $('#confirmationModal .modal-body').append(`
          <div class="confirmation-msg">
               <p class="mb-4">Please, confirm the information below before saving the changes.</p>     
               <p><strong>Stock Item: </strong>${ $('#transferItemName').val() }</p>
               <p><strong>Stock Item: </strong>${ $('#transferInventoryNumber').val() }</p>
               <p><strong>User: </strong>${objFormData.toUserName}</p>
               <p><strong>User Number: </strong>${objFormData.toUserNumber}</p>
          </div>`
     );
}


//----------------------------------------------------------------------------------------
// This function return a promise that will be resolved only if the user confir the action.
// If the user clicks on Cancel button it will reject.
//----------------------------------------------------------------------------------------
function waitTransferConfirmation(){
     return new Promise( (resolve, reject) => {
          $('#modalBtnConfirm').click( (event) => {
               resolve(event);
          });
          $('#modalBtnAbort').click( (event) => {
               reject(event);
          });
     });
}

//----------------------------------------------------------------------------------------
// This function validates the Transfer Form and return "true" if all the fields are ok.
//----------------------------------------------------------------------------------------
function validateTransferForm(){
     var formIsValid = true;

     let reqNumber = $('#transferReqNumber').val().trim();
     if( reqNumber.length == 0 || reqNumber.split(' ').length > 1 || reqNumber.length > 8 || reqNumber.slice(0,3) != '000' || hasLetters(reqNumber) || hasSpecialChar(reqNumber) ){
          setFormFieldInvalid('#transferReqNumber', '#transferReqNumberFeedback', 'Provide a valid requisition number');
          formIsValid = false;
     } else { setFormFieldValid('#transferReqNumber', '#transferReqNumberFeedback', 'Ok'); }

     let department = $('#transferDepartment').val().trim();
     if( department.length == 0 || department.split(' ').length > 1 || department.length > 20 || hasNumbers(department) || hasSpecialChar(department) ){
          setFormFieldInvalid('#transferDepartment', '#transferDepartmentFeedback', 'Provide a valid department name');
          formIsValid = false;
     } else { setFormFieldValid('#transferDepartment', '#transferDepartmentFeedback', 'Ok'); }

     let branch = $('#transferBranch').val().trim();
     if( branch.length == 0 || branch.split(' ').length > 1 || branch.length > 8 || hasNumbers(branch) || hasSpecialChar(branch) ){
          setFormFieldInvalid('#transferBranch', '#transferBranchFeedback', 'Provide a valid branch name');
          formIsValid = false;
     } else { setFormFieldValid('#transferBranch', '#transferBranchFeedback', 'Ok'); }

     let division = $('#transferDivision').val().trim();
     if( division.length == 0 || division.split(' ').length > 1 || division.length > 3 || hasNumbers(division) || hasSpecialChar(division) ){
          setFormFieldInvalid('#transferDivision', '#transferDivisionFeedback', 'Provide a valid division name');
          formIsValid = false;
     } else { setFormFieldValid('#transferDivision', '#transferDivisionFeedback', 'Ok'); }

     let userNumber = $('#transferUserNumber').val().trim();
     if( userNumber.length == 0 || userNumber.split(' ').length > 1 || parseInt( userNumber ) <= 0 || parseInt( userNumber ) > 1999 || hasLetters(userNumber) || hasSpecialChar(userNumber) ){
          setFormFieldInvalid('#transferUserNumber', '#transferUserNumberFeedback', 'Invalid user number');
          formIsValid = false;
     } else { setFormFieldValid('#transferUserNumber', '#transferUserNumberFeedback', 'Ok'); }

     let fullUserName = $('#transferUserName').val().trim().replace(/\s+/g, ' ');
     if( fullUserName.length == 0 || fullUserName.split(' ').length < 2 || hasNumbers(fullUserName) || hasSpecialChar(fullUserName) ){
          setFormFieldInvalid('#transferUserName', '#transferUserNameFeedback', 'Provide full user name');
          formIsValid = false;
     } else { setFormFieldValid('#transferUserName', '#transferUserNameFeedback', 'Ok'); }

     if( !$('#transferOldItemRow').prop('hidden') ) {
          let oldItemNumber = $('#transferOldItem').val().trim().replace(/\s+/g, ' ');
          if( oldItemNumber.length != 6 || oldItemNumber.split(' ').length > 1 || hasLetters(oldItemNumber) || hasSpecialChar(oldItemNumber) ){
               setFormFieldInvalid('#transferOldItem', '#transferOldItemFeedback', 'Use only numbers');
               formIsValid = false;
          } else { setFormFieldValid('#transferOldItem', '#transferOldItemFeedback', 'Ok'); }
     }

     let reason = $('#transferReason').val();
     if( reason === null ){
          setFormFieldInvalid('#transferReason', '#transferReasonFeedback', 'Please, select a reason for this transfer');
          formIsValid = false;
     } else { setFormFieldValid('#transferReason', '#transferReasonFeedback', 'Ok'); }

     return formIsValid;
}

function hasSpecialChar(str){
     if( str.match(/[$-/:-?{-~!"^_`\[\]#@]/) !== null )
     return true;
     else return false;
}

function hasLetters(str){
     if( str.match(/[a-z]/i) !== null )
     return true;
     else return false;
}

function hasNumbers(str){
     if( str.match(/[0-9]/i) !== null ) 
     return true;
     else return false;
}

function setFormFieldInvalid(fieldId, feedbackId, text){
     $(fieldId).focus().select();
     $(fieldId).removeClass('is-valid').addClass('is-invalid');
     $(feedbackId).removeClass('valid-feedback').addClass('invalid-feedback').text(text);
}

function setFormFieldValid(fieldId, feedbackId, text){
     $(fieldId).removeClass('is-invalid').addClass('is-valid');
     $(feedbackId).removeClass('invalid-feedback').addClass('valid-feedback').text(text);
}

//----------------------------------------------------------------------------------------
// This function submits the data passed through the Transfer Form (#formTransfer)
// This form is built inside the modal body when the "Transfer" tab is selected.
// Data is first converted to JSON and then sent through an UPDATE HTTP request.
//----------------------------------------------------------------------------------------
function submitFormTransfer(objFormData){
     const token = localStorage.getItem('bearerToken');
     
     $.ajax({
          url: `/inventory/items/transfer/${objFormData.stockItemId}`,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(objFormData),
          dataType: 'json',
          beforeSend: (xhr, settings) => {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        })
     .done( (data, textStatus, jqXHR) => {
          if(jqXHR.readyState === 4 && jqXHR.status === 200){
               console.log(`Transfer stock item - PUT request status: ${textStatus}`);
               console.log('Response data: ', data);

               $('#inventoryModal').modal('hide');
               showInventoryAlert('success');
               clearTableContent();
               loadInventoryTable();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR responseText: ${jqXHR.responseText}`);
          console.error(`Error: ${errorThrown}`);
          
          $('#inventoryModal').modal('hide');
          let errorAlertMsg = `<strong>Failed</strong> to transfer <strong>${ $('#transferItemName').val().split(' ')[0] } (${ $('#transferInventoryNumber').val() })</strong>.`;
          showInventoryAlert('danger');
     });
}


//----------------------------------------------------------------------------------------
// The function shows an Alert component above the table everytime the Transfer Form is subimited.
// The message will be passed as a parameter and the "type" must match a Bootstrap class for Alert.
// According to the "type", there will be a corresponding symbol. 
//----------------------------------------------------------------------------------------
function showInventoryAlert(type){
     const innerMsg = `The <strong>${ $('#transferItemName').val().split(' ')[0] } (${ $('#transferInventoryNumber').val() })</strong> was successfully transferred.`;
     var symbol = '';
     if(type == 'success') symbol = `<i class="fas fa-check-circle"></i>`;
     if(type == 'danger') symbol = `<i class="fas fa-exclamation-triangle"></i>`;

     $('main.container header.container').after(`
          <div class="my-alert alert alert-${type} mt-5 d-flex justify-content-between align-items-center" role="alert">
               <div>
                    ${symbol} ${innerMsg}
               </div>
               <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
               </button>
          </div>
     `);
}
