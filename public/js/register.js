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
    console.log('Categoria selecionada: ', categoryId);

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
    console.log(selectedModel);

    $('#modelSpecs').remove();
    $('#selectItemModel').after(`
    <div id='modelSpecs'>
        <h5>Model specifications:</h5>
        <ul class='pl-4' id='ListOfModelSpecs'></ul>
        <div class="form-group">
            <label for="inputInventoryNumber">Inventory Number:</label>
            <input class="form-control" id="inputInventoryNumber" type="text" value="CJF ">
        </div>
        <button type="button" id="btnRegisterNewItem" class="btn btn-success">Register New Stock Item</button>
    </div>`);



    
    $('#inputInventoryNumber').on('focus click', eventHandler => {
        if( eventHandler.target.selectionEnd < 4 ){
            eventHandler.target.selectionStart = eventHandler.target.value.length;
            eventHandler.target.selectionEnd = eventHandler.target.value.length;
        }
    });



    $('#inputInventoryNumber').on('keydown', eventHandler => {
        const inputText = eventHandler.target.value;
        const inputTextLength = eventHandler.target.value.length;
        const currentCursorPosition = eventHandler.target.selectionEnd;
        console.log('Text: ', inputText);
        console.log('Length: ', inputTextLength);
        console.log('Cursor Position before: ', currentCursorPosition);
        
        // Allows the user to use only numbers and the keys delete, backspace, arrow left and arrow right
        if( ( eventHandler.which < 48 || eventHandler.which > 57 ) &&
            ( eventHandler.which < 96 || eventHandler.which > 105 ) &&
            eventHandler.key !== 'Backspace' && eventHandler.key !== 'Delete' &&
            eventHandler.key !== 'ArrowLeft' && eventHandler.key !== 'ArrowRight' &&
            eventHandler.key !== 'Home' && eventHandler.key !== 'End' )
        {
            console.log('Tecla pressionada não é válida.');
            eventHandler.preventDefault();
        }

        // If Home key is pressed, it will position the cursor in the position 4 intead of position 0
        if( eventHandler.key === 'Home' ){
            eventHandler.target.selectionStart = 4;
            eventHandler.target.selectionEnd = 4;
        }

        // If the cursor is on the position 4, it cannot be moved to the left using the ArrowLeft, Backspace or Home keys
        if (  eventHandler.target.selectionEnd === 4 &&
            ( eventHandler.key === 'Backspace' || eventHandler.key === 'ArrowLeft' || eventHandler.key === 'Home' ) )
        {  
            eventHandler.preventDefault();
        }

        // When the input field has already 11 chars, it allows only the use of the arrows and delete/backsapce keys
        if ( inputTextLength === 11 && 
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


    $('#inputInventoryNumber').on('keyup', eventHandler => {
        const inputText = eventHandler.target.value;
        const indexOfDot = inputText.indexOf('.');
        const currentCursorPosition = eventHandler.target.selectionEnd;
        console.log('Cursor Position after: ', currentCursorPosition);

        if( inputText.length < 11 && inputText.length >= 8){
            if(indexOfDot < 0)
                var newInputText = inputText.slice(0, 7) + '.' + inputText.slice(7)
            else{
                let tempText = inputText.slice(0, indexOfDot) + inputText.slice(indexOfDot+1);
                var newInputText = tempText.slice(0, 7) + '.' + tempText.slice(7)
            }

            eventHandler.target.value = newInputText;
            if(eventHandler.key === 'Backspace'){
                eventHandler.target.selectionStart = currentCursorPosition;
                eventHandler.target.selectionEnd = currentCursorPosition;
            }
        }
    });





    const specs = selectedModel[0].specs;
    console.log(specs);
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('#ListOfModelSpecs').append(`<li><span class='model-spec'>${specStr}: </span>${specs[spec]}</li>`);
     }
}