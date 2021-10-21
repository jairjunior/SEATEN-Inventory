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
    const inventoryPrefix = 'CJF '
    console.log(selectedModel[0]);

    $('#modelSpecs').remove();
    $('#selectItemModel').after(`
    <div id='modelSpecs'>
        <h5>Model specifications:</h5>
        <ul class='pl-4' id='ListOfModelSpecs'></ul>
        <div class="form-group">
            <label for="inputInventoryNumber">Inventory Number:</label>
            <input class="form-control" id="inputInventoryNumber" type="text" value="${inventoryPrefix}">
        </div>
        <button type="button" id="btnRegisterNewItem" class="btn btn-success">Register New Stock Item</button>
    </div>`);    

    inventoryNumberFieldCursorControl();
    inventoryNumberFieldInputRules();
    inventoryNumberFieldDotControl();

    const specs = selectedModel[0].specs;
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('#ListOfModelSpecs').append(`<li><span class='model-spec'>${specStr}: </span>${specs[spec]}</li>`);
     }
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

