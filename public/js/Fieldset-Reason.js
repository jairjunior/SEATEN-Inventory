"use strict";

export default class FieldsetReason {

     constructor({ root }){
          this.root = root;
     }


     render(){
          this.selectId = 'select-Reason';

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Reason</legend>
                    <div class="form-row">
                         <div class="form-group col-md-12">
                              <label for='${this.selectId}' class="sr-only">Select:</label>
                              <select class='form-control' name='reason' id='${this.selectId}' aria-describedby="registrationReasonFeedback" required>
                                   <option value='New registration' selected>New registration</option>
                                   <option value='Donation'>Donation</option>
                                   <option value='Keep in stock'>Keep in stock</option>
                              </select>
                              <div id="registrationReasonFeedback"></div>
                         </div>
                    </div>
               </fieldset>
          `);
     }


     empty(){
          this.root.empty();
     }

}
