"use strict";
import FieldsetSelectItemModel from './Fieldset-SelectItemModel.js';
import FieldsetTicketNumber from './Fieldset-TicketNumber.js';
import FieldsetInventoryNumber from './Fieldset-InventoryNumber.js';
import FieldsetProvider from './Fieldset-Provider.js';
import FieldsetRecipient from './Fieldset-Recipient.js';
import FieldsetReason from './Fieldset-Reason.js';
import FieldsetRemarks from './Fieldset-Remarks.js';
import ButtonRegisterNewItem from './Button-RegisterNewItem.js';


export class RegisterNewItemForm {

     constructor({ root }){
          this.root = $(root);
          
          this.itemSpecs = new FieldsetSelectItemModel({
               root: this.root.children('#ItemSpecs'),
               form: this.root
          });
          this.inventoryNumber = new FieldsetInventoryNumber({ root: this.root.children('#InventoryNumber') });
          this.provider = new FieldsetProvider({ root: this.root.children('#Provider') });
          this.recipient = new FieldsetRecipient({ root: this.root.children('#Recipient') });
          this.ticketNumber = new FieldsetTicketNumber({ root: this.root.children('#TicketNumber') });
          this.reason = new FieldsetReason({ root: this.root.children('#Reason') });
          this.remarks = new FieldsetRemarks({ root: this.root.children('#Remarks') });
          this.btnRegister = new ButtonRegisterNewItem({
               root: this.root.children('#BtnRegister'),
               form: this.root
          });
     }


     render(){
          this.itemSpecs.render();
          this._setEventForShowingOtherFieldsets();
          this._setEventForRemovingOtherFieldsets();
     }


     _setEventForShowingOtherFieldsets(){
          this.root.on('show-other-fieldsets', () => {
               this._removeOtherFieldsets();
               this._showOtherFieldsets();
          });
     }


     _setEventForRemovingOtherFieldsets(){
          this.root.on('remove-other-fieldsets', () => {
               this._removeOtherFieldsets();
          });
          
     }


     _showOtherFieldsets(){
          this.ticketNumber.render();
          this.inventoryNumber.render();
          this.provider.render();
          this.recipient.render();
          this.reason.render();
          this.remarks.render();
          this.btnRegister.render();
     }


     _removeOtherFieldsets(){
          this.ticketNumber.empty();
          this.inventoryNumber.empty();
          this.provider.empty();
          this.recipient.empty();
          this.reason.empty();
          this.remarks.empty();
          this.btnRegister.empty();
     }

}






//----------------------------------------------------------------------------------------
// The function shows an Alert component above the table everytime the Transfer Form is subimited.
// The message will be passed as a parameter and the "type" must match a Bootstrap class for Alert.
// According to the "type", there will be a corresponding symbol.
//----------------------------------------------------------------------------------------
const showAlert = (type, message, afterID) => {
     //const innerMsg = `The <strong>${ $('#transferItemName').val().split(' ')[0] } (${ $('#transferInventoryNumber').val() })</strong> was successfully transferred.`;
     var symbol = '';
     if(type == 'success') symbol = `<i class="fas fa-check-circle"></i>`;
     if(type == 'danger') symbol = `<i class="fas fa-exclamation-triangle"></i>`;

     $(`${afterID}`).after(`
          <div class="my-alert alert alert-${type} mt-5 d-flex justify-content-between align-items-center" role="alert">
               <div>
                    ${symbol} ${message}
               </div>
               <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
               </button>
          </div>
     `);
}