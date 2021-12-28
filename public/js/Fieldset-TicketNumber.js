"use strict";

export default class FieldsetTicketNumber {

     constructor({ root }){
          this.root = root;
     }


     render(){
          this.inputId = 'input-TicketNumber';

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Ticket Number</legend>
                    <div class="form-row">
                         <div class="form-group col-md-12">
                              <label for="${this.inputId}" class="sr-only">Number</label>
                              <input type="tel" class="form-control" id="${this.inputId}" name="ticketNumber" aria-describedby="inputReqNumberFeedback" placeholder="5400000" required>
                              <div id="inputReqNumberFeedback"></div>
                         </div>
                    </div>
               </fieldset>
          `);
     }


     empty(){
          this.root.empty();
     }

}
