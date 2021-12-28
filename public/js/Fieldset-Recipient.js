"use strict";

export default class FieldsetRecipient {

     constructor({ root }){
          this.root = root;
     }


     render(){
          this.inputRecipientNameId = 'input-RecipientName';
          this.inputRecipientRegistrationNumberId = 'input-RecipientRegistrationNumber'
          this.inputRecipientDivisionId = 'input-RecipientDivision'
          this.inputRecipientDepartmentId = 'input-RecipientDepartment'

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Recipient</legend>
                    <div class="form-row">
                         <div class="form-group col-md-9">
                              <label for="${this.inputRecipientNameId}">Full User Name</label>
                              <input type="text" class="form-control" id="${this.inputRecipientNameId}" aria-describedby="recipientUserNameFeedback" name="recipientUserName" placeholder="Valéria Prado Arcirio de Oliveira Braga" required>
                              <div id="recipientUserNameFeedback"></div>
                         </div>
                         <div class="form-group col-md-3">
                              <label for="${this.inputRecipientRegistrationNumberId}">Registration Number</label>
                              <input type="tel" class="form-control" id="${this.inputRecipientRegistrationNumberId}" aria-describedby="recipientRegistrationNumberFeedback" name="recipientRegistrationNumber" placeholder="457" required>
                              <div id="recipientRegistrationNumberFeedback"></div>
                         </div>
                    </div>
                    <div class="form-row">
                         <div class="form-group col-md-6">
                              <label for="${this.inputRecipientDivisionId}">Division</label>
                              <input type="text" class="form-control" id="${this.inputRecipientDivisionId}" aria-describedby="recipientDivisionFeedback" name="recipientDivision" placeholder="STI" required>
                              <div id="recipientDivisionFeedback"></div>
                         </div>
                         <div class="form-group col-md-6">
                              <label for="${this.inputRecipientDepartmentId}">Department</label>
                              <input type="text" class="form-control" id="${this.inputRecipientDepartmentId}" aria-describedby="recipientDepartmentFeedback" name="recipientDepartment" placeholder="SEATEN" required>
                              <div id="recipientDepartmentFeedback"></div>
                         </div>
                    </div>
               </fieldset>
          `);
     }


     empty(){
          this.root.empty();
     }

}
