"use strict";

export default class ModelSpecsList {

     constructor({ root, modelId }){
          this.root = root;
          this.modelId = modelId;
          this._getModelSpecs();
     }


     _getModelSpecs() {
          const models = JSON.parse( sessionStorage.getItem('listOfModels') );
          if( models.length < 1 ){
               return console.error('ERROR in ModelSpecs._getModelSpecs(): No model list found in Session Storage.');
          }
          let selectedModel = models.filter( model => { return model._id === this.modelId })[0];
          this.modelSpecs = selectedModel.specs;
     }


     render() {      
          var specsList = $(`<ul class='pl-4'></ul>`);
          for(let spec in this.modelSpecs){
               let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
               specsList.append(`<li><span class='model-spec'>${specStr}: </span>${this.modelSpecs[spec]}</li>`);
          }
     
          this.root.append(`<p class="model-specs-title m-0">Model Specifications:</p>`);
          this.root.append(specsList);
     }
     
}
