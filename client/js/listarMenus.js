$(document).on( 'ready', function(){
	//Llama a scrollBar en la primera carga de la pagina
	scrollFoods();

	$('.bg-rect').on( 'click', function(){

		id = $(this).attr('option-value');
		$( '.active' ).removeClass('active');//borra la clase active del elemento anterior
		$(':first-child', this ).addClass( 'active' );//asigna la clase al elemento actual
		getLista( id );//llama a la funcion getLista y pasa el id del tipo del menu
	});

	//Toma a navigation como referencia ya que el resto es creado automaticamente
	//y cuando se actualiza ya no funciona
	$('#navigation').on('click', '.food-add' ,function(){
		idMenu = $(this).attr('id');
		addCart( this, idMenu );
	});

});

//********************************************************************************

function getLista( idTipoMenu )
{
	$.ajax({

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
		type: 'GET',
		timeout: 3000

	});
}//end getLista



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