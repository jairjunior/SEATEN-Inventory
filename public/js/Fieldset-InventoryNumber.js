"use strict";

export default class FieldsetInventoryNumber {

     constructor({ root }){
          this.root = root;
     }


     render(){
          this.inputId = 'input-InventoryNumber';

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Inventory Number</legend>
                    <div class="form-row">
                         <div class="form-group col-md-12" id="formGroupInventoryNumber">
                              <label for="${this.inputId}" class="sr-only">Inventory Number:</label>
                              <input type="text" class="form-control" id="${this.inputId}" name="inventoryNumber" aria-describedby="inputInventoryNumberFeedback" required>
                              <div id="inputInventoryNumberFeedback"></div>
                         </div>
                    </div>
               </fieldset>
          `);
     }


     empty(){
          this.root.empty();
     }

}
