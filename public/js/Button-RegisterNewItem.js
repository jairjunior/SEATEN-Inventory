"use strict";
import { httpRequests } from './HTTPRequests.js';

export default class ButtonRegisterNewItem {

     constructor({ root, form }){
          this.root = root;
          this.form = form;
     }


     render(){
          this.btnId = 'btn-RegisterNewItem';
          this.root.html(`
               <button type="button" class="btn btn-success d-block mx-auto mt-5" id="${this.btnId}">Register New Item</button>
          `);
          this.btn = $(`#${this.btnId}`);
          this._setClickEventListenner();
     }


     _setClickEventListenner(){
          this.btn.on('click', () => {
               this._submitForm();
          });
     }


     async _submitForm(){
          const formData = this._getFormData();
          const response = await this._registerNewItem(formData);

          if( response.ok ){
               let { category, inventoryNumber } = response.newItem;
               this._showAlert({
                    type: 'success',
                    text: `The <strong>${category} (${inventoryNumber})</strong> was successfully registered.`
               });
          }
          else{
               console.error('Error: ', response.error);
               this._showAlert({
                    type: 'danger',
                    text: `<strong>ERROR!</strong> ${response.error}`
               });
          }
     }


     _getFormData(){
          return {
               category: this.form.find('[name=category] option:selected').text(),
               itemModelId: this.form.find('[name=itemModelId] option:selected').val(),
               inventoryNumber: this.form.find('[name=inventoryNumber]').val(),
               transferHistory: {
                    ticketNumber: '#' + this.form.find('[name=ticketNumber]').val(),
                    providerUserName: this.form.find('[name=providerUserName]').val(),
                    providerRegistrationNumber: this.form.find('[name=providerRegistrationNumber]').val(),
                    providerDepartment: this.form.find('[name=providerDivision]').val() + ' | ' + this.form.find('[name=providerDepartment]').val(),
                    recipientUserName: this.form.find('[name=recipientUserName]').val(),
                    recipientRegistrationNumber: this.form.find('[name=recipientRegistrationNumber]').val(),
                    recipientDepartment: this.form.find('[name=recipientDivision]').val() + ' | ' + this.form.find('[name=recipientDepartment]').val(),
                    reason: this.form.find('[name=reason] option:selected').val(),
                    remarks: this.form.find('[name=remarks]').val()
               }
          };
     }


     async _registerNewItem(formData){
          try{
               const serverResponse = await httpRequests.createNewStockItem(formData);
               const responseJSON = await serverResponse.json();
               return responseJSON;
          }
          catch(error){
               console.error('ERROR in function _registerNewItem().\n', error);
          }
     }


     _showAlert({ type, text }){
          var symbol = '';
          if(type == 'success') symbol = `<i class="fas fa-check-circle"></i>`;
          if(type == 'danger') symbol = `<i class="fas fa-exclamation-triangle"></i>`;

          $('main header').after(`
               <alert-info type='${type}'>
                    <span slot="alertSymbol" class="mr-3">${symbol}</span>
                    <span slot="alertText">${text}</span>
               </alert-info>
          `);
     }
     

     empty(){
          this.root.empty();
     }

}