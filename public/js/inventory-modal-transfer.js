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
                                   <input type="tel" class="form-control" id="transferUserNumber" name="userNumber" required>
                              </div>
                         </div>
                         <div class="form-row">
                              <div class="form-group col-md-4">
                                   <label for="transferDivision">Division</label>
                                   <input type="text" class="form-control" id="transferDivision" name="division" placeholder="STI" required>
                              </div>
                              <div class="form-group col-md-4">
                                   <label for="transferBranch">Branch</label>
                                   <input type="text" class="form-control" id="transferBranch" name="branch" placeholder="SUTEC" required>
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

               </form>`);
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
     
     if ( validadeTransferForm() ){
          let formData = $('#formTransferTo').serializeArray();
          formData.push({ name: 'stockItemId', value: idSelectedItem });

          var objFormData = {};
          formData.forEach( (currentElement) => {
               var { name, value } = currentElement;
               objFormData[name] = value;
          });
          console.log('Dados do form a serem enviados:', objFormData);
          //submitFormTransfer(objFormData);
     }
     else{
          return console.error('ERROR: Form data is invalid. Please, review all the fields.');
     }

     
});


//----------------------------------------------------------------------------------------
// This function validates the Transfer Form and return "true" if all the fields are ok.
//----------------------------------------------------------------------------------------
function validadeTransferForm(){
     var formIsValid = true;

     let fullUserName = $('#transferUserName').val()
     if( fullUserName.length == 0 || fullUserName.split(' ').length < 2 ){
          $('#transferUserName').removeClass('is-valid').addClass('is-invalid');
          $('#transferUserName').focus().select();
          $('#transferUserNameFeedback').removeClass('invalid-feedback').addClass('invalid-feedback').text('Please, provide full user name.');
          formIsValid = false;
     } else {
          $('#transferUserName').removeClass('is-invalid').addClass('is-valid');
          $('#transferUserNameFeedback').removeClass('invalid-feedback').addClass('valid-feedback').text('Ok.');
     }


     return formIsValid;
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
               console.log('jqXHR object: ', jqXHR.responseText);
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


//----------------------------------------------------------------------------------------
// Clears the content of the main table
//----------------------------------------------------------------------------------------
function clearTableContent(){
     $('.table-inventory thead').empty();
     $('.table-inventory tbody').empty();
     $('.table-inventory tfoot').empty();
     $('.my-table-spinner').show();
}