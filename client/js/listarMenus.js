function getLista( idTipoMenu )
{
	$.ajax({
		beforeSend: function() {
			feedback();
		},
		complete: function() {
			$.unblockUI();
		},
		url: '',
		data: {'ajax':'true','update':'Lista', 'idTipoMenu':idTipoMenu },
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		ifModified: false,
		processData: true,
		success: function( data ) {

			updateLista( data );

		},
		type: 'POST',
		timeout: 3000

	});
}//end getLista


//**********************************************************************************

//Loading feedback
function feedback() {
  	$.blockUI({ css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
    } }); 
}


//***********************************************************************************

function updateLista( data ) 
{
	//Borra todo lo que hay en el contenedor navigation
	content = document.getElementById( 'navigation' );
	while( content.hasChildNodes() )
	{
		content.removeChild( content.firstChild );
	}//end while
	
	var html = '';
	//Por cada menu con datos
	for( i in data.Menus )
	{
		dom = data.DOM;
		dom = dom.replace( '{idMenu}', data.Menus[i].idMenu );
		dom = dom.replace( "{Nombre}", data.Menus[i].Nombre );
		dom = dom.replace( "{Nombre}", data.Menus[i].Nombre );
		dom = dom.replace( "{Ingredientes}", data.Menus[i].Ingredientes );
		dom = dom.replace( "{Precio}", data.Menus[i].Precio );
		dom = dom.replace( "{Type}", data.Menus[i].Type )
		html = html + dom;
	}

	$( "#navigation" ).html( html );
	scrollFoods();//no se porque pero solo si pongo aca funciona :)
}//end updateLista


//**********************************************************************************


function scrollFoods(){			
	$("#navigation").mCustomScrollbar({
		theme: 'dark',
		scrollButtons: {
			enable: true				
		},			
	});
}