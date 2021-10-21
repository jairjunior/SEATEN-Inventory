//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function fetchCategoryList(){
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
function fetchModelList(){
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
}


//----------------------------------------------------------------------------------------
// Event listener for the Category <select> located in the Register page (New Item tab)
// On change of this <selected>, the Model <select> is updated with all models
// belonging the selected category.
//----------------------------------------------------------------------------------------
$('#selectItemCategory').change( eventHandler => {
    let categoryId = $(eventHandler.target).children(':selected').val();
    console.log('Id da categoria selecionada: ', categoryId);

    fillModelSelect(categoryId);
});


//----------------------------------------------------------------------------------------
// This function runs when one category is selected on the Register page (New Item tab).
// It gets the list of models stored in the browser Local Storage, then it filters the list
// using the id of the selected category and finally fills the Model <select>
//----------------------------------------------------------------------------------------
function fillModelSelect(categoryId){
    const itemModelsList = JSON.parse( localStorage.getItem('itemModels') );
    const filteredModels = itemModelsList.filter( model => { return model.categoryId === categoryId });

    $('#selectItemModel').children().slice(1).remove();
    $('#selectItemModel option').eq(0).prop('selected', true);
    $('#selectItemModel').prop('disabled', false);
    if( $('#modelSpecs').length > 0 ) $('#modelSpecs').remove();

    filteredModels.forEach( model => {
        let modelName = model.brand + ' ' + model.name + ' - Contract n. ' + model.contractNumber;
        $('#selectItemModel').append(`<option value='${model._id}'>${modelName}</option>`);
    });
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
$('#selectItemModel').change( eventHandler => {
    let modelId = $(eventHandler.target).children(':selected').val();
    console.log('Id do modelo selecionado: ', modelId);

    showModelSpecs(modelId);
});

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showModelSpecs(modelId){
    if(modelId === ''){
        $('#modelSpecs').remove();
        return;
    }

    const itemModelsList = JSON.parse( localStorage.getItem('itemModels') );
    let selectedModel = itemModelsList.filter( model => { return model._id === modelId });
    console.log(selectedModel[0]);

    if( $('#modelSpecs').length > 0 ) $('#modelSpecs').remove();

    $('#selectItemModel').after(`
    <div id='modelSpecs'>
        <h5>Model Specifications:</h5>
        <ul class='pl-4' id='ListOfModelSpecs'></ul>
    </div>`);

    const specs = selectedModel[0].specs;
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('#ListOfModelSpecs').append(`<li><span class='model-spec'>${specStr}: </span>${specs[spec]}</li>`);
     }
}


//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
function showInventoryNumberFieldset(){
    const inventoryPrefix = 'CJF '
    const PREFIX_LENGTH = inventoryPrefix.length;
    const INPUT_MAX_LENGTH = 11; // pattern: CJF 123.456

    $('#fieldsetItemSpecs').after(`
    <fieldset class="form-group" id="fieldsetInventoryNumber">
        <legend>Inventory Number</legend>
            <div class="form-row">
                <div class="form-group col-md-12">
                    <label for="inputInventoryNumber">Inventory Number:</label>
                    <input type="text" class="form-control" id="inputInventoryNumber" name="inventoryNumber" aria-describedby="inputInventoryNumberFeedback" value="${inventoryPrefix}" required>
                    <div id="inputInventoryNumberFeedback"></div>
                </div>
            </div>
    </fieldset>`);

    // The following functions add event listenners to the input field to format the text
    inventoryNumberFieldCaretControl(PREFIX_LENGTH);
    inventoryNumberFieldKeysControl(PREFIX_LENGTH, INPUT_MAX_LENGTH);
    inventoryNumberFieldDotControl(PREFIX_LENGTH, INPUT_MAX_LENGTH);


    //<button type="button" id="btnRegisterNewItem" class="btn btn-success">Register New Stock Item</button>
}


//----------------------------------------------------------------------------------------
// Set of functions to format and constrain the field where the user put the inventory number
// These functions ensure that the inventory number keep the pattern: "CJF 123.456"
//----------------------------------------------------------------------------------------
function inventoryNumberFieldCaretControl(PREFIX_LENGTH){
    $('#inputInventoryNumber').on('focus click', eventHandler => {
        var element = eventHandler.target;

        if( element.selectionEnd < PREFIX_LENGTH ){
            element.selectionStart = element.value.length;
            element.selectionEnd = element.value.length;
        }
    });


    $('#inputInventoryNumber').on('select', eventHandler => {
        var element = eventHandler.target;

        if( element.selectionStart < PREFIX_LENGTH && element.selectionEnd >= PREFIX_LENGTH){
            element.selectionStart = element.selectionEnd;
        }
        else if( element.selectionStart >= PREFIX_LENGTH && element.selectionEnd < PREFIX_LENGTH){
            element.selectionEnd = element.selectionStart;
        }
        else if( element.selectionStart < PREFIX_LENGTH && element.selectionEnd < PREFIX_LENGTH){
            element.selectionStart = PREFIX_LENGTH;
            element.selectionEnd = PREFIX_LENGTH;
        }
    });
}

function inventoryNumberFieldKeysControl(PREFIX_LENGTH, INPUT_MAX_LENGTH){
    $('#inputInventoryNumber').on('keydown', eventHandler => {
        var element = eventHandler.target;
        const inputTextLength = element.value.length;
        const DIGIT_CODE_0 = 48;
        const DIGIT_CODE_9 = 57;
        const NUMPAD_CODE_0 = 96;
        const NUMPAD_CODE_9 = 105;
        
        // Allows the user to use only numbers and the keys delete, backspace, home, end, arrow left and arrow right
        if( ( eventHandler.which < DIGIT_CODE_0 || eventHandler.which > DIGIT_CODE_9 ) &&
            ( eventHandler.which < NUMPAD_CODE_0 || eventHandler.which > NUMPAD_CODE_9 ) &&
            eventHandler.key !== 'Backspace' && eventHandler.key !== 'Delete' &&
            eventHandler.key !== 'ArrowLeft' && eventHandler.key !== 'ArrowRight' &&
            eventHandler.key !== 'Home' && eventHandler.key !== 'End' )
        {
            console.log('Tecla pressionada não é válida.');
            eventHandler.preventDefault();
        }

        // If Home key is pressed, it will position the caret in the position 4 intead of position 0
        if( eventHandler.key === 'Home' ){
            element.selectionStart = PREFIX_LENGTH;
            element.selectionEnd = PREFIX_LENGTH;
        }

        // If the caret is in the position 4, it cannot be moved to the left using the ArrowLeft, Backspace or Home keys
        if (  element.selectionEnd == PREFIX_LENGTH &&
            ( eventHandler.key === 'Backspace' || eventHandler.key === 'ArrowLeft' || eventHandler.key === 'Home' ) )
        {  
            eventHandler.preventDefault();
        }

        // When the input field has already 11 chars, it allows only the use of the arrows, delete/backsapce and home/end keys
        if ( inputTextLength === INPUT_MAX_LENGTH && 
             eventHandler.key !== 'Backspace' &&
             eventHandler.key !== 'Delete' &&
             eventHandler.key !== 'ArrowLeft' &&
             eventHandler.key !== 'ArrowRight' &&
             eventHandler.key !== 'Home' &&
             eventHandler.key !== 'End' )
            {
                eventHandler.preventDefault();
            }
    });
}

function inventoryNumberFieldDotControl(PREFIX_LENGTH, INPUT_MAX_LENGTH){
    $('#inputInventoryNumber').on('keyup', eventHandler => {
        var element = eventHandler.target;
        const inputText = element.value;
        const indexOfDot = inputText.indexOf('.');
        const currentCaretPosition = element.selectionEnd;
        const DOT_POSITION = 8;

        if( inputText.length < INPUT_MAX_LENGTH && inputText.length >= DOT_POSITION ){
            if(indexOfDot < 0)
                var newInputText = inputText.slice(0, 7) + '.' + inputText.slice(7)
            else{
                let tempText = inputText.slice(0, indexOfDot) + inputText.slice(indexOfDot+1);
                var newInputText = tempText.slice(0, 7) + '.' + tempText.slice(7);
            }
            element.value = newInputText;
            
            repositionCaret(eventHandler, currentCaretPosition);
        }
        else if(inputText.length < INPUT_MAX_LENGTH && inputText.length >= PREFIX_LENGTH && indexOfDot >= 0){
            var newInputText = inputText.slice(0, indexOfDot) + inputText.slice(indexOfDot+1);
            element.value = newInputText;
            repositionCaret(eventHandler, currentCaretPosition);
        }
    });
}

function repositionCaret(eventHandler, currentCaretPosition){
    var element = eventHandler.target;
    if( eventHandler.key === 'Backspace' || eventHandler.key === 'Delete'){
        element.selectionStart = currentCaretPosition;
        element.selectionEnd = currentCaretPosition;
    }
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
                <label for="ToUserName">Full User Name</label>
                <input type="text" class="form-control" id="ToUserName" aria-describedby="ToUserNameFeedback" name="ToUserName" value="Valéria Prado Arcirio de Oliveira Braga" required>
                <div id="ToUserNameFeedback"></div>
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
