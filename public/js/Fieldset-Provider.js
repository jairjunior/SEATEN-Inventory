"use strict";

export default class FieldsetProvider {

     constructor({ root }){
          this.root = root;
     }


     render(){
          this.inputProviderNameId = 'input-ProviderName';
          this.inputProviderRegistrationNumberId = 'input-ProviderRegistrationNumber'
          this.inputProviderDivisionId = 'input-ProviderDivision'
          this.inputProviderDepartmentId = 'input-ProviderDepartment'

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Provider</legend>
                    <div class="form-row">
                         <div class="form-group col-md-9">
                              <label for="${this.inputProviderNameId}">Full User Name</label>
                              <input type="text" class="form-control" id="${this.inputProviderNameId}" aria-describedby="providerUserNameFeedback" name="providerUserName" placeholder="José Milton Severino Botelho" required>
                              <div id="providerUserNameFeedback"></div>
                         </div>
                         <div class="form-group col-md-3">
                              <label for="${this.inputProviderRegistrationNumberId}">Registration Number</label>
                              <input type="tel" class="form-control" id="${this.inputProviderRegistrationNumberId}" aria-describedby="providerRegistrationNumberFeedback" name="providerRegistrationNumber" placeholder="129" required>
                              <div id="providerRegistrationNumberFeedback"></div>
                         </div>
                    </div>
                    <div class="form-row">
                         <div class="form-group col-md-6">
                              <label for="${this.inputProviderDivisionId}">Division</label>
                              <input type="text" class="form-control" id="${this.inputProviderDivisionId}" aria-describedby="providerDivisionFeedback" name="providerDivision" placeholder="SAD" required>
                              <div id="providerDivisionFeedback"></div>
                         </div>
                         <div class="form-group col-md-6">
                              <label for="${this.inputProviderDepartmentId}">Department</label>
                              <input type="text" class="form-control" id="${this.inputProviderDepartmentId}" aria-describedby="providerDepartmentFeedback" name="providerDepartment" placeholder="SEMAPA" required>
                              <div id="providerDepartmentFeedback"></div>
                         </div>
                    </div>
               </fieldset>
          `);
     }


     empty(){
          this.root.empty();
     }

}
