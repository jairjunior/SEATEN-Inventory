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
            <input class="form-control" id="inputInventoryNumber" type="text" placeholder="">
        </div>
        <button type="button" id="btnRegisterNewItem" class="btn btn-success">Register New Stock Item</button>
    </div>`);

    const specs = selectedModel[0].specs;
    console.log(specs);
     for(let spec in specs){
          let specStr = spec.charAt(0).toUpperCase() + spec.slice(1);
          $('#ListOfModelSpecs').append(`<li><span class='model-spec'>${specStr}: </span>${specs[spec]}</li>`);
     }
}