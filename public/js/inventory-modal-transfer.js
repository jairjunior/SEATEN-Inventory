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
     $('.my-modal-spinner').hide();
     hideAndShowModalButtons('.modal-btn-cancel, .modal-btn-transfer');
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
     let item = JSON.parse( localStorage.getItem( 'selectedItem') );
     let inventoryNumberStr = item.inventoryNumber.slice(0,3) + ' ' + item.inventoryNumber.slice(3,6) + '.' + item.inventoryNumber.slice(6);
     let modalBody = $('#inventoryModal div.modal-body');
     $(modalBody)
     .append(  `<h4 class="modal-item-title mb-4">Transfer Item</h4>
               <form class="mt-3" id="formTransferTo">

                    <fieldset class="form-group item-info">
                         <legend>Item Info</legend>
                         <div class="form-row">
                              <div class="form-group col-md-8">
                                   <label for="transferItemName">Name and Model</label>
                                   <input type="tel" class="form-control" id="transferItemName" name="itemName" value="${item.category} - ${item.itemModelId.brand} ${item.itemModelId.name}" required disabled>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferInventoryNumber">Inventory Number</label>
                                   <input type="tel" class="form-control" id="transferInventoryNumber" name="inventoryNumber" value="${inventoryNumberStr}" required disabled>
                              </div>
                         </div>
                    </fieldset>

                    <fieldset class="form-group">
                         <legend>User Info</legend>
                         <div class="form-row">
                              <div class="form-group col-md-9">
                                   <label for="transferUserName">Full Name</label>
                                   <input type="text" class="form-control" id="transferUserName" aria-describedby="transferUserNameFeedback" name="fullUserName" required>
                                   <div id="transferUserNameFeedback"></div>
                              </div>
                              <div class="form-group col-md-3">
                                   <label for="transferUserNumber">User Number</label>
                                   <input type="tel" class="form-control" id="transferUserNumber" aria-describedby="transferUserNumberFeedback" name="userNumber" required>
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

               </form>`
     );

     $('#transferUserName').focus().select();
}


//----------------------------------------------------------------------------------------
// When the button "Transfer" on the modal is clicked, it gets all the data from the form
// and adds the id of the selected item in the end of the array.
// Then, it converts the array to an object and calls the function to send it to the server
// as a PUT HTTP request
//----------------------------------------------------------------------------------------
$('.modal-btn-transfer').click( () => {
     let idSelectedItem = localStorage.getItem('idSelectedItem');
     if( !idSelectedItem ) return console.error('ERROR: No Id found in Local Storage. Please, contact the System Admin to fix this bug.');
     
     if ( validateTransferForm() ){
          let formData = $('#formTransferTo').serializeArray();
          formData.push({ name: 'stockItemId', value: idSelectedItem });

          var objFormData = {};
          formData.forEach( (currentElement) => {
               var { name, value } = currentElement;
               objFormData[name] = value;
          });
          console.log('Transfer Form data:', objFormData);
          submitFormTransfer(objFormData);
     }
     else{
          return console.error('ERROR: Form data is invalid. Please, review all the fields.');
     }
});


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
          setFormFieldInvalid('#transferUserName', '#transferUserNameFeedback', 'Please, provide full user name');
          formIsValid = false;
     } else { setFormFieldValid('#transferUserName', '#transferUserNameFeedback', 'Ok'); }

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
// This function submits the data passed through the Transfer Form (#formTransferTo)
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
               console.log('Response: ', data);
               console.log('jqXHR responseText: ', jqXHR.responseText);
               $('#inventoryModal').modal('hide');
               clearTableContent();
               loadInventoryTable();
          }
     })
     .fail( (jqXHR, textStatus, errorThrown) => {
          console.error(`Status: ${textStatus}`);
          console.error(`jqXHR object: ${jqXHR.responseText}`);
          console.error(`Error: ${errorThrown}`);
     });
}