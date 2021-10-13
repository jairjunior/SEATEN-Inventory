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
              console.log(data);



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
              console.log(data);



         }
    })
    .fail( (jqXHR, textStatus, errorThrown) => {
         console.error(`Status: ${textStatus}`);
         console.error(`jqXHR object: ${jqXHR}`);
         console.error(`Error: ${errorThrown}`);
    });
}