"use strict";
import ModelSpecsList from "./ModelSpecsList.js";

export default class FieldsetSelectItemModel {

     constructor({ root, form }){
          this.root = root;
          this.form = form;
     }


     render(){
          this.categorySelectId = 'select-Category';
          this.modelSelectId = 'select-Model';

          this.root.html(`
               <fieldset class="form-group">
                    <legend>Item Specs</legend>
                    <div class="form-row">
                         <div class="form-group col-md-12">
                              <label for="${this.categorySelectId}">Category</label>
                              <select class="form-control" id="${this.categorySelectId}" name="category">
                                   <option selected disabled value='a'>---</option>
                              </select>
                         </div>
                    </div>
                    <div class="form-row">
                         <div class="form-group col-md-12">
                              <label for="${this.modelSelectId}">Model</label>
                              <select class="form-control" id="${this.modelSelectId}" name="itemModelId" disabled>
                                   <option disabled value=''>---</option>
                              </select>
                         </div>
                    </div>
                    <div class="mt-2" id="div-ModelSpecs"></div>
               </fieldset>
          `);

          this.categorySelect = $(`#${this.categorySelectId}`);
          this.modelSelect = $(`#${this.modelSelectId}`);
          this.modelSpecsDiv = $('#div-ModelSpecs');

          this._fillCategorySelect();
          this._setEventListenerForCategorySelect();
          this._setEventListenerForModelSelect();
     }


     _fillCategorySelect() {
          const categories = JSON.parse( sessionStorage.getItem('listOfCategories') );
          if( categories.length < 1 ){
               return console.error('ERROR in _fillCategorySelect(): No category list found in Session Storage.');
          }

          categories.forEach( category => {
               this.categorySelect.append(`<option value='${category._id}'>${category.name}</option>`);
          });
      }


      _setEventListenerForCategorySelect() {
          this.categorySelect.change( eventHandler => {
               let categoryId = $(eventHandler.target).children(':selected').val();

               this.modelSpecsDiv.empty();
               this.form.trigger('remove-other-fieldsets');
               this._fillModelSelect(categoryId);
          });
      }


     _fillModelSelect(categoryId) {
          const models = JSON.parse( sessionStorage.getItem('listOfModels') );
          if( models.length < 1 ){
               return console.error('ERROR in _fillModelSelect(): No model list found in Session Storage.');
          }
          const filteredModels = models.filter( model => { return model.categoryId === categoryId });
     
          this.modelSelect.prop('disabled', false);
          $(`#${this.modelSelectId} option`).slice(1).remove();
          $(`#${this.modelSelectId} option`).eq(0).prop('selected', true);
      
          filteredModels.forEach( model => {
               let modelName = model.brand + ' ' + model.name + ' - Contract n. ' + model.contractNumber;
               this.modelSelect.append(`<option value='${model._id}'>${modelName}</option>`);
          });
     }


     _setEventListenerForModelSelect() {
          this.modelSelect.change( eventHandler => {
               let modelId = $(eventHandler.target).children(':selected').val();
               const modelSpecsList = new ModelSpecsList({
                    root: this.modelSpecsDiv,
                    modelId: modelId
               });
               this.modelSpecsDiv.empty();
               modelSpecsList.render();
               this.form.trigger('show-other-fieldsets');
          });
     }

}
