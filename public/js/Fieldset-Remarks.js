"use strict";

export default class FieldsetRemarks {

     constructor({ root }){
          this.root = root;
     }


     render(){
          this.textAreaId = 'textArea-Remarks';

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Remarks</legend>
                    <div class="form-row">
                         <div class="form-group col-md-12">
                              <textarea class="form-control" id="${this.textAreaId}" name="remarks" rows='4' placeholder='Make any observation (optional)...' aria-describedby="remarksHelp"></textarea>
                         </div>
                    </div>
               </fieldset>
          `);
     }


     empty(){
          this.root.empty();
     }

}
