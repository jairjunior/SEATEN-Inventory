"use strict";
import CJFInventoryNumberInput from "./CJFInventoryNumberInput.js";

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
export function fetchCategoryList(){
    const token = localStorage.getItem('bearerToken');

    $.ajax({
        url: '/inventory/categories',
        type: 'GET',
        dataType: 'json',
        beforeSend: (xhr, settings) => {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    })
    .done( (data, textStatus, jqXHR) => {
        if(jqXHR.readyState === 4 && jqXHR.status === 200){
            console.log(`Succeed to retrieve list of categories - status: ${textStatus}`);
            const { categories } = data;
            console.log(categories);
            localStorage.setItem( 'itemCategories' , JSON.stringify(categories) );
            fillCategorySelect(categories);
        }
    })
    .fail( (jqXHR, textStatus, errorThrown) => {
        console.error(`Status: ${textStatus}`);
        console.error(`jqXHR object: ${jqXHR}`);
        console.error(`Error: ${errorThrown}`);
    });
}



//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
export function fetchModelList(){
    const token = localStorage.getItem('bearerToken');

    $.ajax({
        url: '/inventory/models',
        type: 'GET',
        dataType: 'json',
        beforeSend: (xhr, settings) => {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    })
    .done( (data, textStatus, jqXHR) => {
        if(jqXHR.readyState === 4 && jqXHR.status === 200){
            console.log(`Succeed to retrieve list of models - status: ${textStatus}`);
            const { itemModels } = data;
            console.log(itemModels);
            localStorage.setItem( 'itemModels' , JSON.stringify(itemModels) );
        }
    })
    .fail( (jqXHR, textStatus, errorThrown) => {
        console.error(`Status: ${textStatus}`);
        console.error(`jqXHR object: ${jqXHR}`);
        console.error(`Error: ${errorThrown}`);
    });
}


//----------------------------------------------------------------------------------------
// This function receives an array containing all the categories registered in the DB.
// Then it fills the Category <select> on the Register page (New Item tab)
//----------------------------------------------------------------------------------------
function fillCategorySelect(categoryList){
    categoryList.forEach( category => {
        $('#selectItemCategory').append(`<option value='${category._id}'>${category.name}</option>`);
    });

    setEventListenerForCategorySelect();
}


//----------------------------------------------------------------------------------------
// Event listener for the Category <select> located in the Register page (New Item tab)
// On change of this <selected>, the Model <select> is updated with all models
// belonging the selected category.
//----------------------------------------------------------------------------------------
function setEventListenerForCategorySelect(){
    $('#selectItemCategory').change( eventHandler => {
        let categoryId = $(eventHandler.target).children(':selected').val();
        console.log('Id da categoria selecionada: ', categoryId);

        removeListOfModelSpecs();
        removeFormFieldsets();
        removeBtnRegisterNewStockItem();

        fillModelSelect(categoryId);
    });
}


//----------------------------------------------------------------------------------------
// This function runs when one category is selected on the Register page (New Item tab).
// It gets the list of models stored in the browser Local Storage, then it filters the list
// using the id of the selected category and finally fills the Model <select>
//----------------------------------------------------------------------------------------
function fillModelSelect(categoryId){
    const itemModelsList = JSON.parse( localStorage.getItem('itemModels') );
    const filteredModels = itemModelsList.filter( model => { return model.categoryId === categoryId });

    $('#selectItemModel option').slice(1).remove();
    $('#selectItemModel option').eq(0).prop('selected', true);

    filteredModels.forEach( model => {
        let modelName = model.brand + ' ' + model.name + ' - Contract n. ' + model.contractNumber;
        $('#selectItemModel').append(`<option value='${model._id}'>${modelName}</option>`);
    });

    $('#selectItemModel').prop('disabled', false);
    setEventListenerForModelSelect();
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function setEventListenerForModelSelect(){
    $('#selectItemModel').change( eventHandler => {
        let modelId = $(eventHandler.target).children(':selected').val();
        console.log('Id do modelo selecionado: ', modelId);

        showModelSpecs(modelId);
        removeFormFieldsets();
        showInventoryNumberFieldset();
        showRequisitionInfoFieldset();
        showFromUserFieldset();
        showToUserFieldset();
        showReasonFieldset();
        showRemarksFieldset();
        showBtnRegisterNewStockItem();
    });
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showModelSpecs(modelId){
    if(modelId === '') return console.error('ERROR: No ID for the item model selected.');

    const itemModelsList = JSON.parse( localStorage.getItem('itemModels') );
    let selectedModel = itemModelsList.filter( model => { return model._id === modelId });
    console.log('Dados do modelo selecionado: ', selectedModel[0]);

    removeListOfModelSpecs();

    $('#selectItemModel').after(`
    <div id='registerModelSpecs'>
        <h5>Model Specifications:</h5>
        <ul class='pl-4' id='ListOfModelSpecs'></ul>
    </div>`);

    const specs = selectedModel[0].specs;
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('#ListOfModelSpecs').append(`<li><span class='model-spec'>${specStr}: </span>${specs[spec]}</li>`);
     }
}

// Auxiliary funtions
function removeListOfModelSpecs(){
    if( $('#registerModelSpecs').length > 0 ) $('#registerModelSpecs').remove();
}

function removeFormFieldsets(){
    if( $('#fieldsetInventoryNumber').length > 0 ) $('#fieldsetInventoryNumber').remove();
    if( $('#fieldsetRequisitionInfo').length > 0 ) $('#fieldsetRequisitionInfo').remove();
    if( $('#fieldsetFromUser').length > 0 ) $('#fieldsetFromUser').remove();
    if( $('#fieldsetToUser').length > 0 ) $('#fieldsetToUser').remove();
    if( $('#fieldsetReason').length > 0 ) $('#fieldsetReason').remove();
    if( $('#fieldsetRemarks').length > 0 ) $('#fieldsetRemarks').remove();
}

function removeBtnRegisterNewStockItem(){
    if( $('#btnRegisterNewStockItem').length > 0 ) $('#btnRegisterNewStockItem').remove();
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showInventoryNumberFieldset(){

    $('#fieldsetItemSpecs').after(`
    <fieldset class="form-group" id="fieldsetInventoryNumber">
        <legend>Inventory Number</legend>
            <div class="form-row">
                <div class="form-group col-md-12" id="formGroupInventoryNumber">
                    <label for="inputInventoryNumber">Inventory Number:</label>
                    <input type="text" class="form-control" id="inputInventoryNumber" name="inventoryNumber" aria-describedby="inputInventoryNumberFeedback" required>
                    <div id="inputInventoryNumberFeedback"></div>
                </div>
            </div>
    </fieldset>`);

    /*
    const inventoryNumberInputField = new FormatHTMLTextInput("#inputInventoryNumber", { maxLength: 6 });
    inventoryNumberInputField.setPrefixText({ prefixText: 'CJF ', fixed: true });
    inventoryNumberInputField.allowOnlyNumericEntries();
    inventoryNumberInputField.setFixedSymbol({ symbol: '.', symbolPosition: 8 });
    */


    const inventoryNumberInputField = new CJFInventoryNumberInput("#inputInventoryNumber");

}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showRequisitionInfoFieldset(){
    $('#fieldsetInventoryNumber').after(`
    <fieldset class="form-group" id="fieldsetRequisitionInfo">
        <legend>Requisition Info</legend>
        <div class="form-row">
            <div class="form-group col-md-3">
                <label for="selectReqType">Type</label>
                <select id="selectReqType" class="form-control" name="reqType" required>
                    <option selected>RITM</option>
                    <option>INC</option>
                </select>
            </div>
            <div class="form-group col-md-9">
                <label for="inputReqNumber">Number</label>
                <input type="tel" class="form-control" id="inputReqNumber" name="reqNumber" aria-describedby="inputReqNumberFeedback" placeholder="00017123" required>
                <div id="inputReqNumberFeedback"></div>
            </div>
        </div>
    </fieldset>`);
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showFromUserFieldset(){
    $('#fieldsetRequisitionInfo').after(`
    <fieldset class="form-group" id="fieldsetFromUser">
        <legend>From</legend>
        <div class="form-row">
            <div class="form-group col-md-9">
                <label for="fromUserName">Full User Name</label>
                <input type="text" class="form-control" id="fromUserName" aria-describedby="fromUserNameFeedback" name="fromUserName" value="José Milton Severino Botelho" required>
                <div id="fromUserNameFeedback"></div>
            </div>
            <div class="form-group col-md-3">
                <label for="fromRegistrationNumber">Registration Number</label>
                <input type="tel" class="form-control" id="fromRegistrationNumber" aria-describedby="fromRegistrationNumberFeedback" name="fromRegistrationNumber" value="129" required>
                <div id="fromRegistrationNumberFeedback"></div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-4">
                <label for="fromDivision">Division</label>
                <input type="text" class="form-control" id="fromDivision" aria-describedby="fromDivisionFeedback" name="fromDivision" value="SAD" required>
                <div id="fromDivisionFeedback"></div>
            </div>
            <div class="form-group col-md-4">
                <label for="fromBranch">Branch</label>
                <input type="text" class="form-control" id="fromBranch" aria-describedby="fromBranchFeedback" name="fromBranch" value="SUCOP" required>
                <div id="fromBranchFeedback"></div>
            </div>
            <div class="form-group col-md-4">
                <label for="fromDepartment">Department</label>
                <input type="text" class="form-control" id="fromDepartment" aria-describedby="fromDepartmentFeedback" name="fromDepartment" value="SEMAPA" required>
                <div id="fromDepartmentFeedback"></div>
            </div>
        </div>
    </fieldset>`);
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showToUserFieldset(){
    $('#fieldsetFromUser').after(`
    <fieldset class="form-group" id="fieldsetToUser">
        <legend>To</legend>
        <div class="form-row">
            <div class="form-group col-md-9">
                <label for="toUserName">Full User Name</label>
                <input type="text" class="form-control" id="toUserName" aria-describedby="toUserNameFeedback" name="toUserName" value="Valéria Prado Arcirio de Oliveira Braga" required>
                <div id="toUserNameFeedback"></div>
            </div>
            <div class="form-group col-md-3">
                <label for="toRegistrationNumber">Registration Number</label>
                <input type="tel" class="form-control" id="toRegistrationNumber" aria-describedby="toRegistrationNumberFeedback" name="toRegistrationNumber" value="457" required>
                <div id="toRegistrationNumberFeedback"></div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-4">
                <label for="toDivision">Division</label>
                <input type="text" class="form-control" id="toDivision" aria-describedby="toDivisionFeedback" name="toDivision" value="STI" required>
                <div id="toDivisionFeedback"></div>
            </div>
            <div class="form-group col-md-4">
                <label for="toBranch">Branch</label>
                <input type="text" class="form-control" id="toBranch" aria-describedby="toBranchFeedback" name="toBranch" value="SUTEC" required>
                <div id="toBranchFeedback"></div>
            </div>
            <div class="form-group col-md-4">
                <label for="toDepartment">Department</label>
                <input type="text" class="form-control" id="toDepartment" aria-describedby="toDepartmentFeedback" name="toDepartment" value="SEATEN" required>
                <div id="toDepartmentFeedback"></div>
            </div>
        </div>
    </fieldset>`);
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showReasonFieldset(){
    $('#fieldsetToUser').after(`
    <fieldset class="form-group" id="fieldsetReason">
        <legend>Reason</legend>
        <div class="form-row">
            <div class="form-group col-md-12">
                <label for='registrationReason'>Select:</label>
                <select class='form-control' name='reason' id='registrationReason' aria-describedby="registrationReasonFeedback" required>
                    <option value='New registration' selected>New registration</option>
                    <option value='Donation'>Donation</option>
                    <option value='Keep in stock'>Keep in stock</option>
                    <option value='New installation'>New installation</option>
                    <option value='Repair / Warranty'>Repair / Warranty</option>
                    <option value='Replacement'>Replacement</option>
                    <option value='Without use'>Without use</option>
                </select>
                <div id="registrationReasonFeedback"></div>
            </div>
        </div>
    </fieldset>`);
}

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showRemarksFieldset(){
    $('#fieldsetReason').after(`
    <fieldset class="form-group" id="fieldsetRemarks">
        <legend>Remarks</legend>
        <div class="form-row">
            <div class="form-group col-md-12">
                <textarea class="form-control" id="registrationRemarks" name="remarks" rows='4' placeholder='Make any observation (optional)...' aria-describedby="remarksHelp"></textarea>
            </div>
        </div>
    </fieldset>`);
}


function showBtnRegisterNewStockItem(){
    $('#fieldsetRemarks').after(`<button type="button" id="btnRegisterNewStockItem" class="btn btn-success">Register New Stock Item</button>`);

    clickBtnRegisterNewItem();
}


function clickBtnRegisterNewItem(){
    $('#btnRegisterNewStockItem').on('click', () => {
        const category = $('#selectItemCategory option:selected').text();
        const itemModelId = $('#selectItemModel option:selected').val();

        let formData = $('#formRegisterStockItem').serializeArray();
        formData.push(  
            { name: 'category', value : category }, 
            { name: 'itemModelId', value: itemModelId }
        );

        var objFormData = {};
        formData.forEach( (currentElement) => {
            var { name, value } = currentElement;
            objFormData[name] = value;
        });
        console.log(formData);
        console.log(objFormData);
    });
}